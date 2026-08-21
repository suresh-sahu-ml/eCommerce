package com.perfumeshop.catalog.entity;

import com.perfumeshop.common.audit.BaseEntity;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;

import java.math.BigDecimal;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "products", indexes = {
    @Index(name = "idx_product_name", columnList = "product_name"),
    @Index(name = "idx_sku", columnList = "sku", unique = true)
})
public class Product extends BaseEntity {

    @Id
    @SequenceGenerator(name = "product_seq", sequenceName = "product_seq", allocationSize = 1)
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "product_seq")
    @Column(name = "product_id")
    private Long productId;

    @NotBlank(message = "Product name is required")
    @Column(name = "product_name", nullable = false, length = 255)
    private String productName;

    @NotBlank(message = "SKU is required")
    @Column(name = "sku", nullable = false, unique = true, length = 50)
    private String sku;

    @Column(name = "description", length = 1000)
    private String description;

    @NotNull(message = "Price is required")
    @DecimalMin(value = "0.01", message = "Price must be greater than 0")
    @Column(name = "price", nullable = false, precision = 10, scale = 2)
    private BigDecimal price;

    @NotNull(message = "Stock quantity is required")
    @Min(value = 0, message = "Stock quantity cannot be negative")
    @Column(name = "stock_quantity", nullable = false)
    private Integer stockQuantity;

    @Column(name = "brand", length = 100)
    private String brand;

    @Column(name = "volume_ml")
    private Integer volumeMl;

    @Column(name = "olfactive_family", length = 100)
    private String olfactiveFamily;

    @Column(name = "is_active")
    private boolean isActive = true;

    @Column(name = "discount_type", length = 20)
    private String discountType; // FIXED or PERCENTAGE

    @Column(name = "discount_value", precision = 10, scale = 2)
    private BigDecimal discountValue; // Amount or percentage

    @Column(name = "is_discount_active")
    private Boolean isDiscountActive = false;

    @ManyToMany
    @JoinTable(
        name = "product_notes",
        joinColumns = @JoinColumn(name = "product_id"),
        inverseJoinColumns = @JoinColumn(name = "note_id")
    )
    private Set<PerfumeNote> perfumeNotes = new HashSet<>();

    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private Set<ProductImage> images = new HashSet<>();

    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private Set<ProductSize> sizes = new HashSet<>();

    public Product() {
    }

    public Product(String productName, String sku, BigDecimal price, Integer stockQuantity) {
        this.productName = productName;
        this.sku = sku;
        this.price = price;
        this.stockQuantity = stockQuantity;
    }

    public Long getProductId() {
        return productId;
    }

    public void setProductId(Long productId) {
        this.productId = productId;
    }

    public String getProductName() {
        return productName;
    }

    public void setProductName(String productName) {
        this.productName = productName;
    }

    public String getSku() {
        return sku;
    }

    public void setSku(String sku) {
        this.sku = sku;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public BigDecimal getPrice() {
        return price;
    }

    public void setPrice(BigDecimal price) {
        this.price = price;
    }

    public Integer getStockQuantity() {
        return stockQuantity;
    }

    public void setStockQuantity(Integer stockQuantity) {
        this.stockQuantity = stockQuantity;
    }

    public String getBrand() {
        return brand;
    }

    public void setBrand(String brand) {
        this.brand = brand;
    }

    public Integer getVolumeMl() {
        return volumeMl;
    }

    public void setVolumeMl(Integer volumeMl) {
        this.volumeMl = volumeMl;
    }

    public String getOlfactiveFamily() {
        return olfactiveFamily;
    }

    public void setOlfactiveFamily(String olfactiveFamily) {
        this.olfactiveFamily = olfactiveFamily;
    }

    public boolean isActive() {
        return isActive;
    }

    public void setActive(boolean active) {
        isActive = active;
    }

    public Set<PerfumeNote> getPerfumeNotes() {
        return perfumeNotes;
    }

    public void setPerfumeNotes(Set<PerfumeNote> perfumeNotes) {
        this.perfumeNotes = perfumeNotes;
    }

    public Set<ProductImage> getImages() {
        return images;
    }

    public void setImages(Set<ProductImage> images) {
        this.images = images;
    }

    public Set<ProductSize> getSizes() {
        return sizes;
    }

    public void setSizes(Set<ProductSize> sizes) {
        this.sizes = sizes;
    }

    public String getDiscountType() {
        return discountType;
    }

    public void setDiscountType(String discountType) {
        this.discountType = discountType;
    }

    public BigDecimal getDiscountValue() {
        return discountValue;
    }

    public void setDiscountValue(BigDecimal discountValue) {
        this.discountValue = discountValue;
    }

    public boolean isDiscountActive() {
        return isDiscountActive != null && isDiscountActive;
    }

    public void setDiscountActive(boolean discountActive) {
        isDiscountActive = discountActive;
    }

    public BigDecimal getDiscountedPrice() {
        if (!isDiscountActive() || discountValue == null || discountValue.compareTo(BigDecimal.ZERO) <= 0) {
            return price;
        }

        if ("FIXED".equals(discountType)) {
            return price.subtract(discountValue);
        } else if ("PERCENTAGE".equals(discountType)) {
            BigDecimal discountAmount = price.multiply(discountValue).divide(new BigDecimal(100));
            return price.subtract(discountAmount);
        }

        return price;
    }
}
