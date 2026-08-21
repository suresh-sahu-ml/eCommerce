package com.perfumeshop.catalog.dto;

import java.math.BigDecimal;

public class ProductSizeDto {
    private Long sizeId;
    private String sizeName;
    private Integer sizeValue;
    private BigDecimal price;
    private Integer displayOrder;

    public ProductSizeDto() {
    }

    public ProductSizeDto(String sizeName, Integer sizeValue, BigDecimal price, Integer displayOrder) {
        this.sizeName = sizeName;
        this.sizeValue = sizeValue;
        this.price = price;
        this.displayOrder = displayOrder;
    }

    public Long getSizeId() {
        return sizeId;
    }

    public void setSizeId(Long sizeId) {
        this.sizeId = sizeId;
    }

    public String getSizeName() {
        return sizeName;
    }

    public void setSizeName(String sizeName) {
        this.sizeName = sizeName;
    }

    public Integer getSizeValue() {
        return sizeValue;
    }

    public void setSizeValue(Integer sizeValue) {
        this.sizeValue = sizeValue;
    }

    public BigDecimal getPrice() {
        return price;
    }

    public void setPrice(BigDecimal price) {
        this.price = price;
    }

    public Integer getDisplayOrder() {
        return displayOrder;
    }

    public void setDisplayOrder(Integer displayOrder) {
        this.displayOrder = displayOrder;
    }
}
