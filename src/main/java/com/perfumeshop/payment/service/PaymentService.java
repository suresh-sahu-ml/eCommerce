package com.perfumeshop.payment.service;

import com.perfumeshop.payment.entity.Payment;
import com.perfumeshop.payment.dto.CreateOrderRequest;
import com.perfumeshop.payment.dto.OrderResponse;
import com.perfumeshop.payment.dto.PaymentVerifyRequest;
import com.perfumeshop.payment.repository.PaymentRepository;
import com.perfumeshop.auth.entity.User;
import com.perfumeshop.order.entity.Cart;
import com.perfumeshop.order.entity.CartItem;
import com.perfumeshop.order.entity.Order;
import com.perfumeshop.order.entity.OrderItem;
import com.perfumeshop.order.repository.CartRepository;
import com.perfumeshop.order.repository.OrderRepository;
import com.razorpay.RazorpayClient;
import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import jakarta.transaction.Transactional;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.HexFormat;

@Service
public class PaymentService {

    private static final Logger logger = LoggerFactory.getLogger(PaymentService.class);

    @Autowired
    private RazorpayClient razorpayClient;

    @Autowired
    private PaymentRepository paymentRepository;

    @Autowired
    private CartRepository cartRepository;

    @Autowired
    private OrderRepository orderRepository;

    @Value("${razorpay.key.secret}")
    private String razorpayKeySecret;

    @Transactional
    public OrderResponse createOrder(User user, BigDecimal amount, String cartId, CreateOrderRequest request) {
        try {
            // Amount in paise (multiply by 100)
            long amountInPaise = amount.multiply(BigDecimal.valueOf(100)).longValue();

            // Create Razorpay order
            JSONObject orderJson = new JSONObject();
            orderJson.put("amount", amountInPaise);
            orderJson.put("currency", request.getCurrency());
            orderJson.put("receipt", request.getReceipt());
            orderJson.put("notes", new JSONObject()
                    .put("user_email", user.getEmail())
                    .put("user_id", user.getUserId())
                    .put("notes", request.getNotes())
            );

            com.razorpay.Order razorpayOrder = razorpayClient.orders.create(orderJson);
            String razorpayOrderId = (String) razorpayOrder.get("id");

            logger.info("Razorpay order created: {}", razorpayOrderId);

            // Save payment record
            Payment payment = new Payment();
            payment.setUser(user);
            payment.setAmount(amount);
            payment.setCurrency(request.getCurrency());
            payment.setRazorpayOrderId(razorpayOrderId);
            payment.setReceipt(request.getReceipt());
            payment.setNotes(request.getNotes());
            payment.setStatus("PENDING");

            // Link cart if provided
            if (cartId != null && !cartId.isEmpty()) {
                try {
                    Long cartIdLong = Long.parseLong(cartId);
                    Cart cart = cartRepository.findById(cartIdLong).orElse(null);
                    if (cart != null) {
                        payment.setCart(cart);
                    }
                } catch (NumberFormatException e) {
                    logger.warn("Invalid cart ID provided: {}", cartId);
                }
            }

            paymentRepository.save(payment);

            return new OrderResponse(razorpayOrderId, amountInPaise, request.getCurrency(), request.getReceipt());

        } catch (Exception e) {
            logger.error("Error creating Razorpay order", e);
            throw new RuntimeException("Failed to create order: " + e.getMessage());
        }
    }

    @Transactional
    public Payment verifyPayment(PaymentVerifyRequest verifyRequest) {
        try {
            logger.info("Verifying payment: {}", verifyRequest.getRazorpayPaymentId());

            // Verify signature
            if (!verifySignature(
                    verifyRequest.getRazorpayOrderId(),
                    verifyRequest.getRazorpayPaymentId(),
                    verifyRequest.getRazorpaySignature())) {
                logger.error("Signature verification failed");
                throw new RuntimeException("Signature verification failed");
            }

            // Find payment
            Payment payment = paymentRepository.findByRazorpayOrderId(verifyRequest.getRazorpayOrderId())
                    .orElseThrow(() -> new RuntimeException("Payment not found"));

            // Update payment status
            payment.setRazorpayPaymentId(verifyRequest.getRazorpayPaymentId());
            payment.setRazorpaySignature(verifyRequest.getRazorpaySignature());
            payment.setStatus("SUCCESS");
            payment.setPaidAt(LocalDateTime.now());

            Payment savedPayment = paymentRepository.save(payment);
            logger.info("Payment verified successfully: {}", savedPayment.getPaymentId());

            // Create Order from Cart
            if (payment.getCart() != null) {
                createOrderFromCart(payment.getUser(), payment.getCart());
            }

            return savedPayment;

        } catch (Exception e) {
            logger.error("Error verifying payment", e);
            throw new RuntimeException("Payment verification failed: " + e.getMessage());
        }
    }

    private void createOrderFromCart(User user, Cart cart) {
        try {
            if (cart.getItems() == null || cart.getItems().isEmpty()) {
                logger.warn("Cart is empty, cannot create order");
                return;
            }

            // Calculate total from cart items
            BigDecimal totalAmount = BigDecimal.ZERO;
            for (CartItem cartItem : cart.getItems()) {
                if (cartItem.getPrice() != null) {
                    BigDecimal itemTotal = cartItem.getPrice().multiply(new BigDecimal(cartItem.getQuantity()));
                    totalAmount = totalAmount.add(itemTotal);
                }
            }

            String orderNumber = "ORD-" + System.currentTimeMillis();
            Order order = new Order(orderNumber, user, totalAmount);
            order.setStatus(Order.OrderStatus.CONFIRMED);

            // Copy cart items to order items
            for (CartItem cartItem : cart.getItems()) {
                OrderItem orderItem = new OrderItem(
                    order,
                    cartItem.getProduct(),
                    cartItem.getQuantity(),
                    cartItem.getPrice()
                );
                order.getOrderItems().add(orderItem);
            }

            orderRepository.save(order);
            logger.info("Order created successfully: {}", orderNumber);

            // Clear cart by deleting all items
            cart.getItems().clear();
            cartRepository.save(cart);
            logger.info("Cart cleared after order creation");

        } catch (Exception e) {
            logger.error("Error creating order from cart", e);
        }
    }

    private boolean verifySignature(String orderId, String paymentId, String signature) {
        try {
            String message = orderId + "|" + paymentId;
            Mac mac = Mac.getInstance("HmacSHA256");
            SecretKeySpec secretKey = new SecretKeySpec(
                    razorpayKeySecret.getBytes(),
                    "HmacSHA256"
            );
            mac.init(secretKey);
            byte[] digest = mac.doFinal(message.getBytes());
            String computedSignature = HexFormat.of().formatHex(digest);

            logger.debug("Signature verification: computed={}, provided={}", computedSignature, signature);
            return computedSignature.equals(signature);

        } catch (Exception e) {
            logger.error("Error during signature verification", e);
            return false;
        }
    }

    public Payment getPaymentById(Long paymentId) {
        return paymentRepository.findById(paymentId)
                .orElseThrow(() -> new RuntimeException("Payment not found"));
    }
}
