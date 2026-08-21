package com.perfumeshop.catalog.dto;

import java.math.BigDecimal;

public class CsvProductRequest {
    private String productName;
    private String sku;
    private String description;
    private BigDecimal price;
    private Integer stockQuantity;
    private String brand;
    private Integer volumeMl;
    private String olfactiveFamily;
    private Boolean isActive;
    private String discountType;
    private BigDecimal discountValue;
    private Boolean isDiscountActive;
    private String imageUrl;
    private String additionalImages; // Comma-separated URLs

    public CsvProductRequest() {
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

    public Boolean getIsActive() {
        return isActive;
    }

    public void setIsActive(Boolean isActive) {
        this.isActive = isActive;
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

    public Boolean getIsDiscountActive() {
        return isDiscountActive;
    }

    public void setIsDiscountActive(Boolean isDiscountActive) {
        this.isDiscountActive = isDiscountActive;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public String getAdditionalImages() {
        return additionalImages;
    }

    public void setAdditionalImages(String additionalImages) {
        this.additionalImages = additionalImages;
    }
}
