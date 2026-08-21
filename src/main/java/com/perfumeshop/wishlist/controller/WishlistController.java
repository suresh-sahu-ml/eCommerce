package com.perfumeshop.wishlist.controller;

import com.perfumeshop.auth.entity.User;
import com.perfumeshop.auth.repository.UserRepository;
import com.perfumeshop.catalog.entity.Product;
import com.perfumeshop.catalog.entity.ProductImage;
import com.perfumeshop.catalog.entity.ProductSize;
import com.perfumeshop.catalog.repository.ProductRepository;
import com.perfumeshop.catalog.repository.ProductSizeRepository;
import com.perfumeshop.common.util.JwtUtil;
import com.perfumeshop.wishlist.dto.WishlistResponse;
import com.perfumeshop.wishlist.entity.Wishlist;
import com.perfumeshop.wishlist.repository.WishlistRepository;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.transaction.Transactional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/wishlist")
@CrossOrigin(origins = "http://localhost:3000")
public class WishlistController {

    private static final Logger logger = LoggerFactory.getLogger(WishlistController.class);

    @Autowired
    private WishlistRepository wishlistRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private ProductSizeRepository productSizeRepository;

    @Autowired
    private JwtUtil jwtUtil;

    private User getCurrentUser(HttpServletRequest request) {
        String token = request.getHeader("Authorization");
        if (token == null || !token.startsWith("Bearer ")) {
            return null;
        }

        token = token.substring(7);
        String email = jwtUtil.extractEmailFromToken(token);
        return userRepository.findByEmail(email).orElse(null);
    }

    @PostMapping("/add/{productId}")
    public ResponseEntity<?> addToWishlist(@PathVariable Long productId, @RequestParam(required = false) Long sizeId, HttpServletRequest request) {
        try {
            User user = getCurrentUser(request);
            if (user == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "User not authenticated"));
            }

            Product product = productRepository.findById(productId)
                    .orElseThrow(() -> new RuntimeException("Product not found"));

            // Check if already in wishlist
            if (wishlistRepository.existsByUserAndProduct(user, product)) {
                return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of("error", "Product already in wishlist"));
            }

            Wishlist wishlist = new Wishlist(user, product);

            if (sizeId != null) {
                ProductSize size = productSizeRepository.findById(sizeId).orElse(null);
                if (size != null) {
                    wishlist.setSelectedSize(size);
                }
            }

            Wishlist saved = wishlistRepository.save(wishlist);

            logger.info("Added product {} to wishlist for user {}", productId, user.getEmail());

            List<String> imageUrls = product.getImages().stream()
                    .sorted((a, b) -> Integer.compare(a.getDisplayOrder(), b.getDisplayOrder()))
                    .map(ProductImage::getImageUrl)
                    .collect(Collectors.toList());

            WishlistResponse response = new WishlistResponse(
                    saved.getWishlistId(),
                    product.getProductId(),
                    product.getProductName(),
                    product.getBrand(),
                    product.getPrice(),
                    imageUrls,
                    product.getVolumeMl(),
                    product.getDiscountType(),
                    product.getDiscountValue(),
                    product.isDiscountActive(),
                    product.getDiscountedPrice()
            );

            if (saved.getSelectedSize() != null) {
                response.setSelectedSizeId(saved.getSelectedSize().getSizeId());
                response.setSelectedSizeName(saved.getSelectedSize().getSizeName());
            }

            return ResponseEntity.status(HttpStatus.CREATED).body(response);

        } catch (Exception e) {
            logger.error("Error adding to wishlist", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to add to wishlist"));
        }
    }

    @DeleteMapping("/remove/{productId}")
    @Transactional
    public ResponseEntity<?> removeFromWishlist(@PathVariable Long productId, HttpServletRequest request) {
        try {
            User user = getCurrentUser(request);
            if (user == null) {
                logger.warn("Delete wishlist request from unauthenticated user");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "User not authenticated"));
            }

            Product product = productRepository.findById(productId)
                    .orElse(null);

            if (product == null) {
                logger.warn("Product {} not found for deletion", productId);
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "Product not found"));
            }

            long deletedCount = wishlistRepository.deleteByUserAndProduct(user, product);

            if (deletedCount == 0) {
                logger.warn("Product {} not found in wishlist for user {}", productId, user.getEmail());
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "Product not in wishlist"));
            }

            logger.info("Removed product {} from wishlist for user {}", productId, user.getEmail());

            Map<String, String> response = new HashMap<>();
            response.put("message", "Product removed from wishlist");
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            logger.error("Error removing from wishlist for product: {}", productId, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to remove from wishlist: " + e.getMessage()));
        }
    }

    @GetMapping
    public ResponseEntity<?> getWishlist(HttpServletRequest request) {
        try {
            User user = getCurrentUser(request);
            if (user == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "User not authenticated"));
            }

            List<Wishlist> wishlist = wishlistRepository.findByUser(user);
            List<WishlistResponse> responses = wishlist.stream()
                    .map(w -> {
                        List<String> imageUrls = w.getProduct().getImages().stream()
                                .sorted((a, b) -> Integer.compare(a.getDisplayOrder(), b.getDisplayOrder()))
                                .map(ProductImage::getImageUrl)
                                .collect(Collectors.toList());
                        WishlistResponse response = new WishlistResponse(
                                w.getWishlistId(),
                                w.getProduct().getProductId(),
                                w.getProduct().getProductName(),
                                w.getProduct().getBrand(),
                                w.getProduct().getPrice(),
                                imageUrls,
                                w.getProduct().getVolumeMl(),
                                w.getProduct().getDiscountType(),
                                w.getProduct().getDiscountValue(),
                                w.getProduct().isDiscountActive(),
                                w.getProduct().getDiscountedPrice()
                        );

                        if (w.getSelectedSize() != null) {
                            response.setSelectedSizeId(w.getSelectedSize().getSizeId());
                            response.setSelectedSizeName(w.getSelectedSize().getSizeName());
                        }

                        return response;
                    })
                    .collect(Collectors.toList());

            return ResponseEntity.ok(responses);

        } catch (Exception e) {
            logger.error("Error fetching wishlist", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to fetch wishlist"));
        }
    }

    @GetMapping("/check/{productId}")
    public ResponseEntity<?> checkIfInWishlist(@PathVariable Long productId, HttpServletRequest request) {
        try {
            User user = getCurrentUser(request);
            if (user == null) {
                return ResponseEntity.ok(Map.of("inWishlist", false));
            }

            Product product = productRepository.findById(productId).orElse(null);
            if (product == null) {
                return ResponseEntity.ok(Map.of("inWishlist", false));
            }

            boolean inWishlist = wishlistRepository.existsByUserAndProduct(user, product);
            return ResponseEntity.ok(Map.of("inWishlist", inWishlist));

        } catch (Exception e) {
            logger.error("Error checking wishlist status", e);
            return ResponseEntity.ok(Map.of("inWishlist", false));
        }
    }
}
