package com.perfumeshop.cart.dto;

import java.math.BigDecimal;
import java.util.List;

public class CartDto {
    private Long cartId;
    private List<CartItemDto> items;
    private BigDecimal totalAmount;
    private Integer itemCount;

    public CartDto() {
    }

    public CartDto(Long cartId, List<CartItemDto> items, BigDecimal totalAmount, Integer itemCount) {
        this.cartId = cartId;
        this.items = items;
        this.totalAmount = totalAmount;
        this.itemCount = itemCount;
    }

    public Long getCartId() {
        return cartId;
    }

    public void setCartId(Long cartId) {
        this.cartId = cartId;
    }

    public List<CartItemDto> getItems() {
        return items;
    }

    public void setItems(List<CartItemDto> items) {
        this.items = items;
    }

    public BigDecimal getTotalAmount() {
        return totalAmount;
    }

    public void setTotalAmount(BigDecimal totalAmount) {
        this.totalAmount = totalAmount;
    }

    public Integer getItemCount() {
        return itemCount;
    }

    public void setItemCount(Integer itemCount) {
        this.itemCount = itemCount;
    }
}
