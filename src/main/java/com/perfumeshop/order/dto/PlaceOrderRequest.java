package com.perfumeshop.order.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import java.util.Set;

public class PlaceOrderRequest {

    @NotBlank(message = "Shipping address is required")
    private String shippingAddress;

    @NotEmpty(message = "Order items cannot be empty")
    private Set<OrderItemRequest> orderItems;

    public PlaceOrderRequest() {
    }

    public PlaceOrderRequest(String shippingAddress, Set<OrderItemRequest> orderItems) {
        this.shippingAddress = shippingAddress;
        this.orderItems = orderItems;
    }

    public String getShippingAddress() {
        return shippingAddress;
    }

    public void setShippingAddress(String shippingAddress) {
        this.shippingAddress = shippingAddress;
    }

    public Set<OrderItemRequest> getOrderItems() {
        return orderItems;
    }

    public void setOrderItems(Set<OrderItemRequest> orderItems) {
        this.orderItems = orderItems;
    }

    public static class OrderItemRequest {
        private Long productId;
        private Integer quantity;

        public OrderItemRequest() {
        }

        public OrderItemRequest(Long productId, Integer quantity) {
            this.productId = productId;
            this.quantity = quantity;
        }

        public Long getProductId() {
            return productId;
        }

        public void setProductId(Long productId) {
            this.productId = productId;
        }

        public Integer getQuantity() {
            return quantity;
        }

        public void setQuantity(Integer quantity) {
            this.quantity = quantity;
        }
    }
}
