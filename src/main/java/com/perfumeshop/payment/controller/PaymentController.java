package com.perfumeshop.payment.controller;

import com.perfumeshop.payment.dto.CreateOrderRequest;
import com.perfumeshop.payment.dto.OrderResponse;
import com.perfumeshop.payment.dto.PaymentVerifyRequest;
import com.perfumeshop.payment.entity.Payment;
import com.perfumeshop.payment.service.PaymentService;
import com.perfumeshop.auth.entity.User;
import com.perfumeshop.auth.service.AuthService;
import com.perfumeshop.auth.service.JwtTokenProvider;
import com.perfumeshop.common.util.JwtUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import jakarta.servlet.http.HttpServletRequest;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/payments")
@CrossOrigin(origins = "http://localhost:3000")
public class PaymentController {

    private static final Logger logger = LoggerFactory.getLogger(PaymentController.class);

    @Autowired
    private PaymentService paymentService;

    @Autowired
    private AuthService authService;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    @Autowired
    private JwtUtil jwtUtil;

    @Value("${razorpay.key.id}")
    private String razorpayKeyId;

    @GetMapping("/config")
    public ResponseEntity<?> getPaymentConfig() {
        Map<String, String> config = new HashMap<>();
        config.put("keyId", razorpayKeyId);
        return ResponseEntity.ok(config);
    }

    @PostMapping("/create-order")
    public ResponseEntity<?> createOrder(
            @RequestBody CreateOrderRequest request,
            @RequestParam(required = false) String cartId,
            Authentication authentication,
            HttpServletRequest httpRequest) {
        try {
            logger.info("Payment create-order called - Authentication: {}", authentication);

            String userEmail = null;

            if (authentication != null && authentication.isAuthenticated()) {
                userEmail = authentication.getName();
                logger.info("Got user from authentication: {}", userEmail);
            } else {
                // Try to extract email from JWT token in Authorization header (supports both custom and Keycloak JWT)
                String token = extractTokenFromRequest(httpRequest);
                if (token != null) {
                    userEmail = jwtUtil.extractEmailFromToken(token);
                    logger.info("Got email from token: {}", userEmail);
                }

                if (userEmail == null) {
                    logger.warn("No valid authentication found for payment endpoint");
                    return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                            .body(Map.of("error", "User not authenticated"));
                }
            }

            User user = authService.getUserFromEmail(userEmail);
            if (user == null) {
                logger.warn("User not found in database for email: {}", userEmail);
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("error", "User not found"));
            }

            logger.info("Creating order for user: {} with amount: {}", userEmail, request.getAmount());

            OrderResponse orderResponse = paymentService.createOrder(
                    user,
                    request.getAmount(),
                    cartId,
                    request
            );

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("order", orderResponse);

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            logger.error("Error creating order", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/verify")
    public ResponseEntity<?> verifyPayment(
            @RequestBody PaymentVerifyRequest verifyRequest,
            Authentication authentication,
            HttpServletRequest httpRequest) {
        try {
            String userEmail = null;

            if (authentication != null && authentication.isAuthenticated()) {
                userEmail = authentication.getName();
                logger.info("Got user from authentication: {}", userEmail);
            } else {
                // Try to extract email from JWT token in Authorization header
                String token = extractTokenFromRequest(httpRequest);
                if (token != null && jwtTokenProvider.validateToken(token)) {
                    userEmail = jwtTokenProvider.getEmailFromToken(token);
                    logger.info("Got email from token: {}", userEmail);
                } else {
                    logger.warn("No valid authentication found for payment endpoint");
                    return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                            .body(Map.of("error", "User not authenticated"));
                }
            }

            User user = authService.getUserFromEmail(userEmail);
            if (user == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("error", "User not found"));
            }

            logger.info("Verifying payment for user: {}", userEmail);

            Payment payment = paymentService.verifyPayment(verifyRequest);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Payment verified successfully");
            response.put("paymentId", payment.getPaymentId());
            response.put("status", payment.getStatus());

            return ResponseEntity.ok(response);

        } catch (RuntimeException e) {
            logger.error("Payment verification failed", e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            logger.error("Error verifying payment", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/{paymentId}")
    public ResponseEntity<?> getPayment(
            @PathVariable Long paymentId,
            Authentication authentication) {
        try {
            if (authentication == null || !authentication.isAuthenticated()) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("error", "User not authenticated"));
            }

            Payment payment = paymentService.getPaymentById(paymentId);

            return ResponseEntity.ok(payment);

        } catch (Exception e) {
            logger.error("Error retrieving payment", e);
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    private String extractTokenFromRequest(HttpServletRequest request) {
        String header = request.getHeader("Authorization");
        if (header != null && header.startsWith("Bearer ")) {
            return header.substring(7);
        }
        return null;
    }
}
