package com.perfumeshop.auth.service;

import com.perfumeshop.auth.entity.User;
import com.perfumeshop.auth.entity.Verification;
import com.perfumeshop.auth.repository.VerificationRepository;
import com.perfumeshop.auth.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.Random;

@Service
public class VerificationService {

    @Autowired
    private VerificationRepository verificationRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private EmailService emailService;

    private static final int VERIFICATION_EXPIRY_MINUTES = 15;
    private static final int MAX_ATTEMPTS = 5;

    public Verification createVerification(User user, String type, String contactValue) {
        // Invalidate previous verifications
        Optional<Verification> existingVerification = verificationRepository
                .findByUserUserIdAndTypeAndIsVerifiedFalse(user.getUserId(), type);

        if (existingVerification.isPresent()) {
            verificationRepository.delete(existingVerification.get());
        }

        String code = generateVerificationCode();
        LocalDateTime expiresAt = LocalDateTime.now().plusMinutes(VERIFICATION_EXPIRY_MINUTES);

        Verification verification = new Verification(user, code, type, contactValue, expiresAt);
        verification = verificationRepository.save(verification);

        // Send verification code via email and SMS
        sendVerificationCode(user.getEmail(), user.getPhoneNumber(), code, type);

        return verification;
    }

    private void sendVerificationCode(String email, String phoneNumber, String code, String type) {
        emailService.sendOtpEmail(email, code);
    }

    public boolean verifyCode(Long userId, String code) {
        Optional<Verification> verificationOpt = verificationRepository.findByCodeAndUserUserId(code, userId);

        if (verificationOpt.isEmpty()) {
            return false;
        }

        Verification verification = verificationOpt.get();

        // Check if expired
        if (LocalDateTime.now().isAfter(verification.getExpiresAt())) {
            return false;
        }

        // Check max attempts
        if (verification.getAttempts() >= MAX_ATTEMPTS) {
            return false;
        }

        // Increment attempts
        verification.setAttempts(verification.getAttempts() + 1);

        // Verify if code matches
        if (verification.getCode().equals(code)) {
            verification.setVerified(true);
            verificationRepository.save(verification);

            // Mark user as verified
            User user = verification.getUser();
            user.setActive(true);
            userRepository.save(user);

            return true;
        }

        verificationRepository.save(verification);
        return false;
    }

    public boolean isUserVerified(Long userId) {
        Optional<User> userOpt = userRepository.findById(userId);
        if (userOpt.isEmpty()) {
            return false;
        }

        return userOpt.get().isActive();
    }

    public void resendVerificationCode(Long userId) {
        Optional<User> userOpt = userRepository.findById(userId);
        if (userOpt.isEmpty()) {
            throw new RuntimeException("User not found");
        }

        User user = userOpt.get();

        if (user.getEmail() == null || user.getEmail().isEmpty()) {
            throw new RuntimeException("Email not found for user");
        }

        createVerification(user, "EMAIL", user.getEmail());
    }

    private String generateVerificationCode() {
        Random random = new Random();
        int code = 100000 + random.nextInt(900000);
        return String.valueOf(code);
    }
}
