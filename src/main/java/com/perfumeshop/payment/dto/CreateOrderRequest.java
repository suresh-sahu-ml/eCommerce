package com.perfumeshop.payment.dto;

import java.math.BigDecimal;

public class CreateOrderRequest {
    private BigDecimal amount;
    private String currency = "INR";
    private String receipt;
    private String notes;

    public CreateOrderRequest() {
    }

    public CreateOrderRequest(BigDecimal amount, String currency, String receipt, String notes) {
        this.amount = amount;
        this.currency = currency;
        this.receipt = receipt;
        this.notes = notes;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public void setAmount(BigDecimal amount) {
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

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }
}
