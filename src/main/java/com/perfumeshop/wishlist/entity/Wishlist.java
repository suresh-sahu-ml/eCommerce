package com.perfumeshop.wishlist.entity;

import com.perfumeshop.auth.entity.User;
import com.perfumeshop.catalog.entity.Product;
import com.perfumeshop.catalog.entity.ProductSize;
import com.perfumeshop.common.audit.BaseEntity;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;

@Entity
@Table(name = "wishlist", indexes = {
    @Index(name = "idx_wishlist_user_id", columnList = "user_id"),
    @Index(name = "idx_wishlist_product_id", columnList = "product_id"),
    @Index(name = "idx_wishlist_user_product", columnList = "user_id,product_id", unique = true)
})
public class Wishlist extends BaseEntity {

    @Id
    @SequenceGenerator(name = "wishlist_seq", sequenceName = "wishlist_seq", allocationSize = 1)
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "wishlist_seq")
    @Column(name = "wishlist_id")
    private Long wishlistId;

    @NotNull(message = "User is required")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @NotNull(message = "Product is required")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "size_id", nullable = true)
    private ProductSize selectedSize;

    public Wishlist() {
    }

    public Wishlist(User user, Product product) {
        this.user = user;
        this.product = product;
    }

    public Long getWishlistId() {
        return wishlistId;
    }

    public void setWishlistId(Long wishlistId) {
        this.wishlistId = wishlistId;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Product getProduct() {
        return product;
    }

    public void setProduct(Product product) {
        this.product = product;
    }

    public ProductSize getSelectedSize() {
        return selectedSize;
    }

    public void setSelectedSize(ProductSize selectedSize) {
        this.selectedSize = selectedSize;
    }
}
