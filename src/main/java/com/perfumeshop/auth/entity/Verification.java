package com.perfumeshop.auth.entity;

import com.perfumeshop.common.audit.BaseEntity;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "verifications")
public class Verification extends BaseEntity {

    @Id
    @SequenceGenerator(name = "verification_seq", sequenceName = "verification_seq", allocationSize = 1)
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "verification_seq")
    @Column(name = "verification_id")
    private Long verificationId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "code", nullable = false, length = 6)
    private String code;

    @Column(name = "type", nullable = false, length = 20)
    private String type; // EMAIL or PHONE

    @Column(name = "contact_value", nullable = false, length = 255)
    private String contactValue; // email or phone number

    @Column(name = "is_verified")
    private boolean isVerified = false;

    @Column(name = "expires_at", nullable = false)
    private LocalDateTime expiresAt;

    @Column(name = "attempts")
    private int attempts = 0;

    public Verification() {
    }

    public Verification(User user, String code, String type, String contactValue, LocalDateTime expiresAt) {
        this.user = user;
        this.code = code;
        this.type = type;
        this.contactValue = contactValue;
        this.expiresAt = expiresAt;
    }

    public Long getVerificationId() {
        return verificationId;
    }

    public void setVerificationId(Long verificationId) {
        this.verificationId = verificationId;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getContactValue() {
        return contactValue;
    }

    public void setContactValue(String contactValue) {
        this.contactValue = contactValue;
    }

    public boolean isVerified() {
        return isVerified;
    }

    public void setVerified(boolean verified) {
        isVerified = verified;
    }

    public LocalDateTime getExpiresAt() {
        return expiresAt;
    }

    public void setExpiresAt(LocalDateTime expiresAt) {
        this.expiresAt = expiresAt;
    }

    public int getAttempts() {
        return attempts;
    }

    public void setAttempts(int attempts) {
        this.attempts = attempts;
    }
}
