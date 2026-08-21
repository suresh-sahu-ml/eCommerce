package com.perfumeshop.wishlist.dto;

import java.math.BigDecimal;
import java.util.List;
import com.fasterxml.jackson.annotation.JsonProperty;

public class WishlistResponse {

    private Long wishlistId;
    private Long productId;
    private String productName;
    private String brand;
    private BigDecimal price;
    private String imageUrl;
    private List<String> imageUrls;
    private Integer volumeMl;
    private String discountType;
    private BigDecimal discountValue;
    @JsonProperty("isDiscountActive")
    private Boolean isDiscountActive;
    private BigDecimal discountedPrice;
    private Long selectedSizeId;
    private String selectedSizeName;

    public WishlistResponse() {
    }

    public WishlistResponse(Long wishlistId, Long productId, String productName, String brand, BigDecimal price, List<String> imageUrls, Integer volumeMl) {
        this.wishlistId = wishlistId;
        this.productId = productId;
        this.productName = productName;
        this.brand = brand;
        this.price = price;
        this.imageUrls = imageUrls;
        this.imageUrl = (imageUrls != null && !imageUrls.isEmpty()) ? imageUrls.get(0) : null;
        this.volumeMl = volumeMl;
    }

    public WishlistResponse(Long wishlistId, Long productId, String productName, String brand, BigDecimal price, List<String> imageUrls, Integer volumeMl, String discountType, BigDecimal discountValue, Boolean isDiscountActive, BigDecimal discountedPrice) {
        this.wishlistId = wishlistId;
        this.productId = productId;
        this.productName = productName;
        this.brand = brand;
        this.price = price;
        this.imageUrls = imageUrls;
        this.imageUrl = (imageUrls != null && !imageUrls.isEmpty()) ? imageUrls.get(0) : null;
        this.volumeMl = volumeMl;
        this.discountType = discountType;
        this.discountValue = discountValue;
        this.isDiscountActive = isDiscountActive;
        this.discountedPrice = discountedPrice;
    }

    public Long getWishlistId() {
        return wishlistId;
    }

    public void setWishlistId(Long wishlistId) {
        this.wishlistId = wishlistId;
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

    public String getBrand() {
        return brand;
    }

    public void setBrand(String brand) {
        this.brand = brand;
    }

    public BigDecimal getPrice() {
        return price;
    }

    public void setPrice(BigDecimal price) {
        this.price = price;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public List<String> getImageUrls() {
        return imageUrls;
    }

    public void setImageUrls(List<String> imageUrls) {
        this.imageUrls = imageUrls;
    }

    public Integer getVolumeMl() {
        return volumeMl;
    }

    public void setVolumeMl(Integer volumeMl) {
        this.volumeMl = volumeMl;
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

    public BigDecimal getDiscountedPrice() {
        return discountedPrice;
    }

    public void setDiscountedPrice(BigDecimal discountedPrice) {
        this.discountedPrice = discountedPrice;
    }

    public Long getSelectedSizeId() {
        return selectedSizeId;
    }

    public void setSelectedSizeId(Long selectedSizeId) {
        this.selectedSizeId = selectedSizeId;
    }

    public String getSelectedSizeName() {
        return selectedSizeName;
    }

    public void setSelectedSizeName(String selectedSizeName) {
        this.selectedSizeName = selectedSizeName;
    }
}
