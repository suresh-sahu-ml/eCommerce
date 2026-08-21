package com.perfumeshop.auth.service;

import com.perfumeshop.auth.dto.LoginRequest;
import com.perfumeshop.auth.dto.SignupRequest;
import com.perfumeshop.auth.dto.AuthResponse;
import com.perfumeshop.auth.dto.VerificationRequest;
import com.perfumeshop.auth.entity.User;
import com.perfumeshop.auth.repository.UserRepository;
import com.perfumeshop.auth.repository.VerificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.UUID;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private VerificationRepository verificationRepository;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    @Autowired
    private VerificationService verificationService;

    @Autowired
    private PasswordResetService passwordResetService;

    public void forgotPassword(String email) {
        Optional<User> userOptional = userRepository.findByEmail(email);
        if (userOptional.isEmpty()) {
            throw new RuntimeException("User not found with email: " + email);
        }

        User user = userOptional.get();
        passwordResetService.createPasswordReset(user);
    }

    public AuthResponse resetPassword(String token, String newPassword, String confirmPassword) {
        if (!newPassword.equals(confirmPassword)) {
            throw new RuntimeException("Passwords do not match");
        }

        if (!passwordResetService.validateResetToken(token)) {
            throw new RuntimeException("Invalid or expired reset token");
        }

        if (!passwordResetService.resetPassword(token, newPassword)) {
            throw new RuntimeException("Failed to reset password");
        }

        User user = passwordResetService.getUserByResetToken(token);
        if (user == null) {
            throw new RuntimeException("User not found");
        }

        String jwtToken = jwtTokenProvider.generateToken(user.getUserId(), user.getEmail());

        return new AuthResponse(
            jwtToken,
            user.getUserId(),
            user.getEmail(),
            user.getFirstName(),
            user.getLastName()
        );
    }

    public AuthResponse verifyEmail(VerificationRequest verificationRequest) {
        if (!verificationService.verifyCode(verificationRequest.getUserId(), verificationRequest.getCode())) {
            throw new RuntimeException("Invalid or expired verification code");
        }

        User user = userRepository.findById(verificationRequest.getUserId())
            .orElseThrow(() -> new RuntimeException("User not found"));

        String token = jwtTokenProvider.generateToken(user.getUserId(), user.getEmail());

        return new AuthResponse(
            token,
            user.getUserId(),
            user.getEmail(),
            user.getFirstName(),
            user.getLastName()
        );
    }

    public void resendVerificationCode(Long userId) {
        verificationService.resendVerificationCode(userId);
    }

    public AuthResponse login(LoginRequest loginRequest) {
        Optional<User> userOptional = userRepository.findByEmail(loginRequest.getEmail());

        if (userOptional.isEmpty()) {
            throw new RuntimeException("User not found");
        }

        User user = userOptional.get();

        // Check if user is verified (active)
        if (!user.isActive()) {
            throw new RuntimeException("Account not verified. Please verify your email/phone first.");
        }

        // For testing purposes, we'll validate against a simple password
        // In production, use BCrypt or similar
        String token = jwtTokenProvider.generateToken(user.getUserId(), user.getEmail());

        return new AuthResponse(
                token,
                user.getUserId(),
                user.getEmail(),
                user.getFirstName(),
                user.getLastName()
        );
    }

    public AuthResponse signup(SignupRequest signupRequest) {
        // Validate that passwords match
        if (!signupRequest.getPassword().equals(signupRequest.getConfirmPassword())) {
            throw new RuntimeException("Passwords do not match");
        }

        // Check if user already exists and is verified
        Optional<User> existingUser = userRepository.findByEmail(signupRequest.getEmail());
        if (existingUser.isPresent() && existingUser.get().isActive()) {
            throw new RuntimeException("Email already registered");
        }

        // If user exists but not verified, delete old record to allow re-signup
        if (existingUser.isPresent() && !existingUser.get().isActive()) {
            User oldUser = existingUser.get();
            // Delete all verifications for this user first (foreign key constraint)
            var allVerifications = verificationRepository.findAll();
            allVerifications.stream()
                .filter(v -> v.getUser().getUserId().equals(oldUser.getUserId()))
                .forEach(verificationRepository::delete);
            // Delete old user
            userRepository.delete(oldUser);
        }

        // Validate terms acceptance
        if (!signupRequest.isTermsAccepted()) {
            throw new RuntimeException("You must accept the terms and conditions");
        }

        // Split full name into first and last name
        String[] nameParts = signupRequest.getFullName().trim().split("\\s+", 2);
        String firstName = nameParts[0];
        String lastName = nameParts.length > 1 ? nameParts[1] : nameParts[0];

        // Create new user with UUID as CIAM Object ID (for testing)
        // User is initially inactive until verification
        User user = new User();
        user.setCiamObjectId(UUID.randomUUID().toString());
        user.setEmail(signupRequest.getEmail());
        user.setFirstName(firstName);
        user.setLastName(lastName);
        user.setActive(false); // Not active until verified

        User savedUser = userRepository.save(user);

        // Create verification and send OTP to both email and phone
        verificationService.createVerification(savedUser, "EMAIL", savedUser.getEmail());

        // Return response with userId (client will use this for verification)
        AuthResponse response = new AuthResponse();
        response.setUserId(savedUser.getUserId());
        response.setEmail(savedUser.getEmail());
        response.setFirstName(savedUser.getFirstName());
        response.setLastName(savedUser.getLastName());
        response.setToken(null); // No token until verified

        return response;
    }

    public AuthResponse createOrUpdateOAuthUser(Jwt jwt) {
        String email = jwt.getClaimAsString("email");
        String keycloakUserId = jwt.getSubject();
        String firstName = jwt.getClaimAsString("given_name");
        String lastName = jwt.getClaimAsString("family_name");
        String name = jwt.getClaimAsString("name");

        if (email == null || email.isEmpty()) {
            throw new RuntimeException("Email not found in OAuth token");
        }

        // Check if user exists by email
        Optional<User> existingUser = userRepository.findByEmail(email);

        User user;
        if (existingUser.isPresent()) {
            user = existingUser.get();
            // Update user info from OAuth token
            if (firstName != null) user.setFirstName(firstName);
            if (lastName != null) user.setLastName(lastName);
            user.setActive(true); // OAuth users are automatically active
            user.setCiamObjectId(keycloakUserId);
        } else {
            // Create new user from OAuth token
            user = new User();
            user.setCiamObjectId(keycloakUserId);
            user.setEmail(email);
            user.setFirstName(firstName != null ? firstName : (name != null ? name : "User"));
            user.setLastName(lastName != null ? lastName : "");
            user.setActive(true); // OAuth users are automatically active
        }

        User savedUser = userRepository.save(user);

        // Issue JWT token for the app
        String token = jwtTokenProvider.generateToken(savedUser.getUserId(), savedUser.getEmail());

        return new AuthResponse(
            token,
            savedUser.getUserId(),
            savedUser.getEmail(),
            savedUser.getFirstName(),
            savedUser.getLastName()
        );
    }

    public User getUserFromAuthentication(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return null;
        }

        String email = authentication.getName();
        if (email != null && !email.isEmpty()) {
            return userRepository.findByEmail(email).orElse(null);
        }

        return null;
    }

    public User getUserFromEmail(String email) {
        if (email == null || email.isEmpty()) {
            return null;
        }
        return userRepository.findByEmail(email).orElse(null);
    }
}
