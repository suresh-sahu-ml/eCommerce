package com.perfumeshop.order.controller;

import com.perfumeshop.auth.entity.User;
import com.perfumeshop.auth.repository.UserRepository;
import com.perfumeshop.auth.service.AuthService;
import com.perfumeshop.auth.service.JwtTokenProvider;
import com.perfumeshop.catalog.entity.Product;
import com.perfumeshop.catalog.repository.ProductRepository;
import com.perfumeshop.common.util.JwtUtil;
import com.perfumeshop.order.dto.OrderResponse;
import com.perfumeshop.order.dto.PlaceOrderRequest;
import com.perfumeshop.order.entity.Order;
import com.perfumeshop.order.entity.OrderItem;
import com.perfumeshop.order.repository.OrderRepository;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.access.prepost.PreAuthorize;

import java.math.BigDecimal;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/orders")
public class OrderController {

    private static final Logger logger = LoggerFactory.getLogger(OrderController.class);

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private AuthService authService;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    @Autowired
    private JwtUtil jwtUtil;

    @GetMapping
    public ResponseEntity<List<OrderResponse>> getUserOrders(
            Authentication authentication,
            HttpServletRequest httpRequest) {
        try {
            String userEmail = null;

            // Try to get email from authentication
            if (authentication != null && authentication.isAuthenticated()) {
                userEmail = authentication.getName();
                logger.info("Got user email from authentication: {}", userEmail);
            } else {
                // Try to extract email from JWT token (supports both custom and Keycloak JWT)
                String token = extractTokenFromRequest(httpRequest);
                if (token != null) {
                    userEmail = jwtUtil.extractEmailFromToken(token);
                    logger.info("Got email from token: {}", userEmail);
                }
            }

            if (userEmail == null) {
                logger.warn("No valid authentication found");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
            }

            User user = authService.getUserFromEmail(userEmail);
            if (user == null) {
                logger.warn("User not found for email: {}", userEmail);
                return ResponseEntity.notFound().build();
            }

            List<Order> orders = orderRepository.findByUserUserId(user.getUserId());
            List<OrderResponse> responses = orders.stream()
                    .map(this::convertToResponse)
                    .toList();

            logger.info("Found {} orders for user: {}", responses.size(), userEmail);
            return ResponseEntity.ok(responses);
        } catch (Exception e) {
            logger.error("Error fetching user orders", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/all")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<OrderResponse>> getAllOrders() {
        try {
            List<Order> orders = orderRepository.findAll();
            List<OrderResponse> responses = orders.stream()
                    .map(this::convertToResponse)
                    .toList();
            logger.info("Found {} total orders", responses.size());
            return ResponseEntity.ok(responses);
        } catch (Exception e) {
            logger.error("Error fetching all orders", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PostMapping
    public ResponseEntity<OrderResponse> placeOrder(
            Authentication authentication,
            @Valid @RequestBody PlaceOrderRequest request) {

        String ciamObjectId = extractCiamObjectId(authentication);
        Optional<User> user = userRepository.findByCiamObjectId(ciamObjectId);

        if (user.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        BigDecimal totalAmount = BigDecimal.ZERO;
        Set<OrderItem> orderItems = new HashSet<>();

        for (PlaceOrderRequest.OrderItemRequest itemRequest : request.getOrderItems()) {
            Optional<Product> product = productRepository.findById(itemRequest.getProductId());
            if (product.isEmpty()) {
                return ResponseEntity.badRequest().build();
            }

            BigDecimal itemTotal = product.get().getPrice().multiply(new BigDecimal(itemRequest.getQuantity()));
            totalAmount = totalAmount.add(itemTotal);

            OrderItem orderItem = new OrderItem(null, product.get(), itemRequest.getQuantity(), product.get().getPrice());
            orderItems.add(orderItem);
        }

        String orderNumber = "ORD-" + System.currentTimeMillis();
        Order order = new Order(orderNumber, user.get(), totalAmount);
        order.setShippingAddress(request.getShippingAddress());
        order.setOrderItems(orderItems);

        for (OrderItem item : orderItems) {
            item.setOrder(order);
        }

        Order savedOrder = orderRepository.save(order);
        return ResponseEntity.status(HttpStatus.CREATED).body(convertToResponse(savedOrder));
    }

    @GetMapping("/{orderNumber}")
    public ResponseEntity<OrderResponse> getOrder(
            Authentication authentication,
            HttpServletRequest httpRequest,
            @PathVariable String orderNumber) {

        try {
            String userEmail = null;

            // Try to get email from authentication
            if (authentication != null && authentication.isAuthenticated()) {
                userEmail = authentication.getName();
                logger.info("Got user email from authentication: {}", userEmail);
            } else {
                // Try to extract email from JWT token (supports both custom and Keycloak JWT)
                String token = extractTokenFromRequest(httpRequest);
                if (token != null) {
                    userEmail = jwtUtil.extractEmailFromToken(token);
                    logger.info("Got email from token: {}", userEmail);
                }
            }

            if (userEmail == null) {
                logger.warn("No valid authentication found");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
            }

            User user = authService.getUserFromEmail(userEmail);
            if (user == null) {
                logger.warn("User not found for email: {}", userEmail);
                return ResponseEntity.notFound().build();
            }

            Optional<Order> order = orderRepository.findByOrderNumber(orderNumber);
            if (order.isEmpty()) {
                return ResponseEntity.notFound().build();
            }

            boolean isAdmin = authentication != null && authentication.getAuthorities().stream()
                    .anyMatch(auth -> auth.getAuthority().equals("ROLE_ADMIN"));

            if (!isAdmin && !order.get().getUser().getUserId().equals(user.getUserId())) {
                return ResponseEntity.notFound().build();
            }

            return ResponseEntity.ok(convertToResponse(order.get()));
        } catch (Exception e) {
            logger.error("Error fetching order", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    private String extractCiamObjectId(Authentication authentication) {
        if (authentication.getPrincipal() instanceof Jwt jwt) {
            return jwt.getClaimAsString("sub");
        }
        return null;
    }

    private OrderResponse convertToResponse(Order order) {
        Set<OrderResponse.OrderItemResponse> items = order.getOrderItems().stream()
                .map(item -> {
                    String imageUrl = null;
                    if (item.getProduct().getImages() != null && !item.getProduct().getImages().isEmpty()) {
                        imageUrl = item.getProduct().getImages().stream()
                            .findFirst()
                            .map(img -> img.getImageUrl())
                            .orElse(null);
                    }
                    return new OrderResponse.OrderItemResponse(
                        item.getOrderItemId(),
                        item.getProduct().getProductId(),
                        item.getProduct().getProductName(),
                        item.getQuantity(),
                        item.getUnitPrice(),
                        item.getLineTotal(),
                        imageUrl
                    );
                })
                .collect(Collectors.toSet());

        OrderResponse response = new OrderResponse(
                order.getOrderId(),
                order.getOrderNumber(),
                order.getTotalAmount(),
                order.getStatus().toString(),
                order.getShippingAddress(),
                items
        );
        response.setCreatedDate(order.getCreatedDate());

        User user = order.getUser();
        if (user != null) {
            OrderResponse.UserInfo userInfo = new OrderResponse.UserInfo(
                    user.getFirstName(),
                    user.getLastName(),
                    user.getEmail()
            );
            response.setUser(userInfo);
        }

        return response;
    }

    private String extractTokenFromRequest(HttpServletRequest request) {
        String header = request.getHeader("Authorization");
        if (header != null && header.startsWith("Bearer ")) {
            return header.substring(7);
        }
        return null;
    }
}
