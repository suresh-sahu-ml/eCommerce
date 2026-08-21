package com.perfumeshop.catalog.dto;

import java.math.BigDecimal;

public class DiscountUpdateRequest {
    private String discountType; // FIXED or PERCENTAGE
    private BigDecimal discountValue;
    private boolean isDiscountActive;

    public DiscountUpdateRequest() {
    }

    public DiscountUpdateRequest(String discountType, BigDecimal discountValue, boolean isDiscountActive) {
        this.discountType = discountType;
        this.discountValue = discountValue;
        this.isDiscountActive = isDiscountActive;
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
}
