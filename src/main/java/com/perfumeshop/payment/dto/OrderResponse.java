package com.perfumeshop.payment.dto;

public class OrderResponse {
    private String orderId;
    private Long amount;
    private String currency;
    private String receipt;

    public OrderResponse(String orderId, Long amount, String currency, String receipt) {
        this.orderId = orderId;
        this.amount = amount;
        this.currency = currency;
        this.receipt = receipt;
    }

    public String getOrderId() {
        return orderId;
    }

    public void setOrderId(String orderId) {
        this.orderId = orderId;
    }

    public Long getAmount() {
        return amount;
    }

    public void setAmount(Long amount) {
        this.amount = amount;
    }

    public String getCurrency() {
        return currency;
    }

    public void setCurrency(String currency) {
        this.currency = currency;
    }

    public String getReceipt() {
        return receipt;
    }

    public void setReceipt(String receipt) {
        this.receipt = receipt;
    }
}
