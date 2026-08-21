package com.perfumeshop.auth.service;

import com.perfumeshop.auth.entity.PasswordReset;
import com.perfumeshop.auth.entity.User;
import com.perfumeshop.auth.repository.PasswordResetRepository;
import com.perfumeshop.auth.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

@Service
public class PasswordResetService {

    @Autowired
    private PasswordResetRepository passwordResetRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private EmailService emailService;

    private static final int RESET_TOKEN_EXPIRY_HOURS = 24;

    public PasswordReset createPasswordReset(User user) {
        // Invalidate previous reset tokens
        Optional<PasswordReset> existingReset = passwordResetRepository.findByUserUserIdAndIsUsedFalse(user.getUserId());
        if (existingReset.isPresent()) {
            passwordResetRepository.delete(existingReset.get());
        }

        String token = UUID.randomUUID().toString();
        LocalDateTime expiresAt = LocalDateTime.now().plusHours(RESET_TOKEN_EXPIRY_HOURS);

        PasswordReset passwordReset = new PasswordReset(user, token, expiresAt);
        passwordReset = passwordResetRepository.save(passwordReset);

        // Send reset email
        sendPasswordResetEmail(user.getEmail(), token);

        return passwordReset;
    }

    public boolean validateResetToken(String token) {
        Optional<PasswordReset> resetOpt = passwordResetRepository.findByTokenAndIsUsedFalse(token);

        if (resetOpt.isEmpty()) {
            return false;
        }

        PasswordReset reset = resetOpt.get();

        // Check if expired
        if (LocalDateTime.now().isAfter(reset.getExpiresAt())) {
            return false;
        }

        return true;
    }

    public boolean resetPassword(String token, String newPassword) {
        Optional<PasswordReset> resetOpt = passwordResetRepository.findByTokenAndIsUsedFalse(token);

        if (resetOpt.isEmpty()) {
            return false;
        }

        PasswordReset reset = resetOpt.get();

        // Check if expired
        if (LocalDateTime.now().isAfter(reset.getExpiresAt())) {
            return false;
        }

        User user = reset.getUser();
        // TODO: Hash password before storing (use BCrypt)
        // For now, just store as-is
        user.setPassword(newPassword);
        userRepository.save(user);

        // Mark token as used
        reset.setUsed(true);
        passwordResetRepository.save(reset);

        return true;
    }

    private void sendPasswordResetEmail(String email, String token) {
        String resetLink = "http://localhost:5173/reset-password?token=" + token;
        String emailContent = "Click the link below to reset your password:\n\n" +
                             resetLink + "\n\n" +
                             "This link will expire in 24 hours.\n\n" +
                             "If you didn't request this, please ignore this email.\n\n" +
                             "The Perfume Shop Team";

        System.out.println("================================");
        System.out.println("Password Reset Email");
        System.out.println("Recipient: " + email);
        System.out.println("Reset Token: " + token);
        System.out.println("Reset Link: " + resetLink);
        System.out.println("Expires in: 24 hours");
        System.out.println("================================");

        // TODO: Integrate with actual email service
        // emailService.sendEmail(email, "Password Reset - The Perfume Shop", emailContent);
    }

    public User getUserByResetToken(String token) {
        Optional<PasswordReset> resetOpt = passwordResetRepository.findByTokenAndIsUsedFalse(token);
        if (resetOpt.isPresent()) {
            return resetOpt.get().getUser();
        }
        return null;
    }
}
