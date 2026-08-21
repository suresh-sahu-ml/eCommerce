package com.perfumeshop.catalog.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.perfumeshop.catalog.dto.ProductSizeDto;

public class ProductResponse {

    private Long productId;
    private String productName;
    private String sku;
    private String description;
    private BigDecimal price;
    private Integer stockQuantity;
    private String brand;
    private Integer volumeMl;
    private String olfactiveFamily;
    private List<String> imageUrls;
    private List<ProductSizeDto> sizes;
    private Set<String> perfumeNotes;
    private boolean isActive;
    private LocalDateTime createdDate;
    private LocalDateTime lastModifiedDate;
    private String discountType; // FIXED or PERCENTAGE
    private BigDecimal discountValue;
    @JsonProperty("isDiscountActive")
    private boolean isDiscountActive;
    private BigDecimal discountedPrice;

    public ProductResponse(Long productId, String productName, String sku, String description,
                          BigDecimal price, Integer stockQuantity, String brand, Integer volumeMl,
                          Set<String> perfumeNotes) {
        this.productId = productId;
        this.productName = productName;
        this.sku = sku;
        this.description = description;
        this.price = price;
        this.stockQuantity = stockQuantity;
        this.brand = brand;
        this.volumeMl = volumeMl;
        this.perfumeNotes = perfumeNotes;
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

    public List<String> getImageUrls() {
        return imageUrls;
    }

    public void setImageUrls(List<String> imageUrls) {
        this.imageUrls = imageUrls;
    }

    public List<ProductSizeDto> getSizes() {
        return sizes;
    }

    public void setSizes(List<ProductSizeDto> sizes) {
        this.sizes = sizes;
    }

    public Set<String> getPerfumeNotes() {
        return perfumeNotes;
    }

    public void setPerfumeNotes(Set<String> perfumeNotes) {
        this.perfumeNotes = perfumeNotes;
    }

    public boolean isActive() {
        return isActive;
    }

    public void setIsActive(boolean active) {
        isActive = active;
    }

    public LocalDateTime getCreatedDate() {
        return createdDate;
    }

    public void setCreatedDate(LocalDateTime createdDate) {
        this.createdDate = createdDate;
    }

    public LocalDateTime getLastModifiedDate() {
        return lastModifiedDate;
    }

    public void setLastModifiedDate(LocalDateTime lastModifiedDate) {
        this.lastModifiedDate = lastModifiedDate;
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
        return isDiscountActive;
    }

    public void setIsDiscountActive(boolean discountActive) {
        isDiscountActive = discountActive;
    }

    public BigDecimal getDiscountedPrice() {
        return discountedPrice;
    }

    public void setDiscountedPrice(BigDecimal discountedPrice) {
        this.discountedPrice = discountedPrice;
    }
}
