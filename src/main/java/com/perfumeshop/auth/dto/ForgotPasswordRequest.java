package com.perfumeshop.auth.dto;

import jakarta.validation.constraints.NotBlank;
import com.perfumeshop.auth.validator.ValidEmail;

public class ForgotPasswordRequest {

    @NotBlank(message = "Email is required")
    @ValidEmail
    private String email;

    public ForgotPasswordRequest() {
    }

    public ForgotPasswordRequest(String email) {
        this.email = email;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }
}
