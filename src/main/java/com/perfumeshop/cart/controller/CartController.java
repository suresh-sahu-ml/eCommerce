package com.perfumeshop.cart.controller;

import com.perfumeshop.cart.dto.CartDto;
import com.perfumeshop.cart.service.CartService;
import com.perfumeshop.auth.entity.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import jakarta.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("/cart")
@CrossOrigin(origins = "http://localhost:5173")
public class CartController {

    private static final Logger logger = LoggerFactory.getLogger(CartController.class);

    @Autowired
    private CartService cartService;

    @PostMapping("/add")
    public ResponseEntity<Map<String, Object>> addToCart(
            Authentication authentication,
            @RequestParam Long productId,
            @RequestParam Long sizeId,
            @RequestParam(defaultValue = "1") Integer quantity) {
        try {
            logger.info("Add to cart request - authentication: {}", authentication);

            String userEmail = null;

            // Try to get user from Authentication
            if (authentication != null && authentication.isAuthenticated()) {
                userEmail = authentication.getName();
                logger.info("Got user from authentication: {}", userEmail);
            } else {
                // Fallback to test user
                logger.warn("No authentication found, using test user");
                userEmail = "test-user@perfumeshop.local";
            }

            logger.info("Adding to cart for user: {}", userEmail);

            User user = new User();
            user.setEmail(userEmail);
            user.setFirstName("Guest");
            user.setLastName("User");
            user.setCiamObjectId("guest-" + System.currentTimeMillis());

            CartDto cart = cartService.addToCart(user, productId, sizeId, quantity);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("cart", cart);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("Error adding to cart", e);
            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        }
    }

    @GetMapping
    public ResponseEntity<CartDto> getCart(Authentication authentication) {
        try {
            String userEmail = (authentication != null && authentication.isAuthenticated())
                    ? authentication.getName()
                    : "test-user@perfumeshop.local";

            User user = createOrGetUser(userEmail);
            CartDto cart = cartService.getCart(user);
            return ResponseEntity.ok(cart);
        } catch (Exception e) {
            logger.error("Error getting cart", e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    @DeleteMapping("/item/{cartItemId}")
    public ResponseEntity<CartDto> removeFromCart(
            Authentication authentication,
            @PathVariable Long cartItemId) {
        try {
            String userEmail = (authentication != null && authentication.isAuthenticated())
                    ? authentication.getName()
                    : "test-user@perfumeshop.local";

            User user = createOrGetUser(userEmail);
            CartDto cart = cartService.removeFromCart(user, cartItemId);
            return ResponseEntity.ok(cart);
        } catch (Exception e) {
            logger.error("Error removing from cart", e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    @PutMapping("/item/{cartItemId}")
    public ResponseEntity<CartDto> updateCartItemQuantity(
            Authentication authentication,
            @PathVariable Long cartItemId,
            @RequestParam Integer quantity) {
        try {
            String userEmail = (authentication != null && authentication.isAuthenticated())
                    ? authentication.getName()
                    : "test-user@perfumeshop.local";

            User user = createOrGetUser(userEmail);
            CartDto cart = cartService.updateCartItemQuantity(user, cartItemId, quantity);
            return ResponseEntity.ok(cart);
        } catch (Exception e) {
            logger.error("Error updating cart item quantity", e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    @DeleteMapping("/clear")
    public ResponseEntity<Map<String, String>> clearCart(Authentication authentication) {
        try {
            String userEmail = (authentication != null && authentication.isAuthenticated())
                    ? authentication.getName()
                    : "test-user@perfumeshop.local";

            User user = createOrGetUser(userEmail);
            cartService.clearCart(user);
            return ResponseEntity.ok(Map.of("message", "Cart cleared successfully"));
        } catch (Exception e) {
            logger.error("Error clearing cart", e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    private User createOrGetUser(String userEmail) {
        User user = new User();
        user.setEmail(userEmail);
        user.setFirstName("Guest");
        user.setLastName("User");
        user.setCiamObjectId("guest-" + System.currentTimeMillis());
        return user;
    }
}
