package com.perfumeshop.catalog.entity;

import com.perfumeshop.common.audit.BaseEntity;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;

@Entity
@Table(name = "product_sizes")
public class ProductSize extends BaseEntity {

    @Id
    @SequenceGenerator(name = "product_size_seq", sequenceName = "product_size_seq", allocationSize = 1)
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "product_size_seq")
    @Column(name = "size_id")
    private Long sizeId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @NotNull(message = "Size name is required")
    @Column(name = "size_name", nullable = false, length = 50)
    private String sizeName;  // e.g., "50 ml", "100 ml"

    @Column(name = "size_value")
    private Integer sizeValue;  // e.g., 50, 100

    @NotNull(message = "Price is required")
    @Column(name = "price", nullable = false, precision = 10, scale = 2)
    private BigDecimal price;

    @Column(name = "display_order")
    private Integer displayOrder = 0;

    public ProductSize() {
    }

    public ProductSize(String sizeName, Integer sizeValue, BigDecimal price, Integer displayOrder) {
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

    public Product getProduct() {
        return product;
    }

    public void setProduct(Product product) {
        this.product = product;
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
