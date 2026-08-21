package com.perfumeshop.cart.service;

import com.perfumeshop.cart.dto.CartDto;
import com.perfumeshop.cart.dto.CartItemDto;
import com.perfumeshop.order.entity.Cart;
import com.perfumeshop.order.entity.CartItem;
import com.perfumeshop.order.repository.CartRepository;
import com.perfumeshop.order.repository.CartItemRepository;
import com.perfumeshop.catalog.entity.Product;
import com.perfumeshop.catalog.entity.ProductSize;
import com.perfumeshop.catalog.repository.ProductRepository;
import com.perfumeshop.catalog.repository.ProductSizeRepository;
import com.perfumeshop.auth.entity.User;
import com.perfumeshop.auth.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import jakarta.transaction.Transactional;
import jakarta.persistence.EntityManager;
import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
public class CartService {

    private static final Logger logger = LoggerFactory.getLogger(CartService.class);

    @Autowired
    private CartRepository cartRepository;

    @Autowired
    private CartItemRepository cartItemRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private ProductSizeRepository productSizeRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private EntityManager entityManager;

    @Transactional
    public CartDto addToCart(User user, Long productId, Long sizeId, Integer quantity) {
        // Ensure user exists in database by email
        User existingUser = userRepository.findByEmail(user.getEmail())
                .orElseGet(() -> {
                    logger.info("Creating new user with email: {}", user.getEmail());
                    User newUser = new User();
                    newUser.setEmail(user.getEmail());
                    newUser.setFirstName(user.getFirstName() != null ? user.getFirstName() : "Guest");
                    newUser.setLastName(user.getLastName() != null ? user.getLastName() : "User");
                    newUser.setCiamObjectId(user.getCiamObjectId() != null ? user.getCiamObjectId() : "guest-" + System.currentTimeMillis());
                    User savedUser = userRepository.save(newUser);
                    entityManager.flush();  // Ensure the ID is generated
                    logger.info("New user created with ID: {} and email: {}", savedUser.getUserId(), savedUser.getEmail());
                    // Reload fresh from database to ensure it's properly attached to session
                    return userRepository.findById(savedUser.getUserId()).get();
                });

        logger.info("Using user ID: {} for cart", existingUser.getUserId());

        Cart cart = cartRepository.findByUserUserId(existingUser.getUserId())
                .orElseGet(() -> {
                    logger.info("Creating new cart for user ID: {}", existingUser.getUserId());
                    Cart newCart = new Cart(existingUser);
                    Cart savedCart = cartRepository.save(newCart);
                    logger.info("New cart created with ID: {}", savedCart.getCartId());
                    return savedCart;
                });

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        ProductSize productSize = productSizeRepository.findById(sizeId)
                .orElseThrow(() -> new RuntimeException("Product size not found"));

        // Check if item already exists in cart
        CartItem existingItem = cartItemRepository
                .findByCartCartIdAndProductProductIdAndProductSizeSizeId(cart.getCartId(), productId, sizeId)
                .orElse(null);

        if (existingItem != null) {
            // Update quantity if item already exists
            existingItem.setQuantity(existingItem.getQuantity() + quantity);
            cartItemRepository.save(existingItem);
            logger.info("Updated existing cart item quantity to: {}", existingItem.getQuantity());
        } else {
            // Add new item to cart
            CartItem newItem = new CartItem(cart, product, productSize, quantity, productSize.getPrice());
            cart.getItems().add(newItem);  // Add to bidirectional relationship
            cartItemRepository.save(newItem);
            logger.info("Created new cart item: product={}, size={}, quantity={}", productId, sizeId, quantity);
        }

        // Flush to ensure database is updated and ID is generated
        entityManager.flush();

        // Refresh the cart to get latest items from database
        entityManager.refresh(cart);

        logger.info("Cart after refresh - items count: {}", cart.getItems().size());

        return getCart(existingUser);
    }

    @Transactional
    public CartDto getCart(User user) {
        // Look up user by email first (user from controller has no ID)
        User existingUser = userRepository.findByEmail(user.getEmail())
                .orElseGet(() -> {
                    logger.info("Creating new user with email: {}", user.getEmail());
                    User newUser = new User();
                    newUser.setEmail(user.getEmail());
                    newUser.setFirstName(user.getFirstName() != null ? user.getFirstName() : "Guest");
                    newUser.setLastName(user.getLastName() != null ? user.getLastName() : "User");
                    newUser.setCiamObjectId(user.getCiamObjectId() != null ? user.getCiamObjectId() : "guest-" + System.currentTimeMillis());
                    User savedUser = userRepository.save(newUser);
                    entityManager.flush();
                    logger.info("New user created with ID: {} and email: {}", savedUser.getUserId(), savedUser.getEmail());
                    return userRepository.findById(savedUser.getUserId()).get();
                });

        Cart cart = cartRepository.findByUserUserId(existingUser.getUserId())
                .orElseGet(() -> {
                    Cart newCart = new Cart(existingUser);
                    return cartRepository.save(newCart);
                });

        List<CartItemDto> items = cart.getItems().stream()
                .map(this::convertToCartItemDto)
                .collect(Collectors.toList());

        BigDecimal totalAmount = items.stream()
                .map(CartItemDto::getTotalPrice)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        Integer itemCount = items.stream()
                .mapToInt(CartItemDto::getQuantity)
                .sum();

        return new CartDto(cart.getCartId(), items, totalAmount, itemCount);
    }

    @Transactional
    public CartDto removeFromCart(User user, Long cartItemId) {
        User existingUser = userRepository.findByEmail(user.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Cart cart = cartRepository.findByUserUserId(existingUser.getUserId())
                .orElseThrow(() -> new RuntimeException("Cart not found"));

        CartItem item = cartItemRepository.findById(cartItemId)
                .orElseThrow(() -> new RuntimeException("Cart item not found"));

        if (!item.getCart().getCartId().equals(cart.getCartId())) {
            throw new RuntimeException("Item does not belong to this cart");
        }

        cartItemRepository.deleteById(cartItemId);
        entityManager.flush();  // Ensure deletion is persisted before reloading cart
        logger.info("Cart item deleted: {}", cartItemId);
        return getCart(user);
    }

    @Transactional
    public CartDto updateCartItemQuantity(User user, Long cartItemId, Integer quantity) {
        User existingUser = userRepository.findByEmail(user.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Cart cart = cartRepository.findByUserUserId(existingUser.getUserId())
                .orElseThrow(() -> new RuntimeException("Cart not found"));

        CartItem item = cartItemRepository.findById(cartItemId)
                .orElseThrow(() -> new RuntimeException("Cart item not found"));

        if (!item.getCart().getCartId().equals(cart.getCartId())) {
            throw new RuntimeException("Item does not belong to this cart");
        }

        if (quantity <= 0) {
            cartItemRepository.deleteById(cartItemId);
            entityManager.flush();
            logger.info("Cart item deleted due to zero quantity: {}", cartItemId);
        } else {
            item.setQuantity(quantity);
            cartItemRepository.save(item);
            entityManager.flush();
            logger.info("Cart item quantity updated: {}, new quantity: {}", cartItemId, quantity);
        }

        return getCart(user);
    }

    @Transactional
    public void clearCart(User user) {
        User existingUser = userRepository.findByEmail(user.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Cart cart = cartRepository.findByUserUserId(existingUser.getUserId())
                .orElseThrow(() -> new RuntimeException("Cart not found"));

        cart.getItems().clear();
        cartRepository.save(cart);
        entityManager.flush();
        logger.info("Cart cleared for user: {}", existingUser.getEmail());
    }

    private CartItemDto convertToCartItemDto(CartItem item) {
        String imageUrl = item.getProduct().getImages().stream()
                .filter(img -> img.isPrimary())
                .findFirst()
                .map(img -> img.getImageUrl())
                .orElse("");

        return new CartItemDto(
                item.getCartItemId(),
                item.getProduct().getProductId(),
                item.getProduct().getProductName(),
                imageUrl,
                item.getProductSize().getSizeId(),
                item.getProductSize().getSizeName(),
                item.getPrice(),
                item.getQuantity(),
                item.getTotalPrice()
        );
    }
}
