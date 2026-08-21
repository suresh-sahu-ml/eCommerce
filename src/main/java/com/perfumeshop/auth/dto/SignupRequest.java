package com.perfumeshop.auth.dto;

import jakarta.validation.constraints.NotBlank;
import com.perfumeshop.auth.validator.ValidEmail;
import com.perfumeshop.auth.validator.ValidPhone;
import com.perfumeshop.auth.validator.StrongPassword;

public class SignupRequest {

    @NotBlank(message = "Full name is required")
    private String fullName;

    @NotBlank(message = "Email is required")
    @ValidEmail
    private String email;

    @NotBlank(message = "Password is required")
    @StrongPassword
    private String password;

    @NotBlank(message = "Confirm password is required")
    private String confirmPassword;

    private boolean termsAccepted;

    public SignupRequest() {
    }

    public SignupRequest(String fullName, String email, String password, String confirmPassword, boolean termsAccepted) {
        this.fullName = fullName;
        this.email = email;
        this.password = password;
        this.confirmPassword = confirmPassword;
        this.termsAccepted = termsAccepted;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getConfirmPassword() {
        return confirmPassword;
    }

    public void setConfirmPassword(String confirmPassword) {
        this.confirmPassword = confirmPassword;
    }

    public boolean isTermsAccepted() {
        return termsAccepted;
    }

    public void setTermsAccepted(boolean termsAccepted) {
        this.termsAccepted = termsAccepted;
    }
}
