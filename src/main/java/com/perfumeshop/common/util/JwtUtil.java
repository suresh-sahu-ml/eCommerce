package com.perfumeshop.common.util;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.perfumeshop.auth.service.JwtTokenProvider;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.Base64;
import java.util.Collection;
import java.util.List;

@Component
public class JwtUtil {

    private static final Logger logger = LoggerFactory.getLogger(JwtUtil.class);

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    private final ObjectMapper objectMapper = new ObjectMapper();

    /**
     * Extract email from either custom JWT or Keycloak JWT
     */
    public String extractEmailFromToken(String token) {
        // Try custom JWT first
        String email = jwtTokenProvider.getEmailFromToken(token);
        if (email != null) {
            logger.debug("Email extracted from custom JWT: {}", email);
            return email;
        }

        // Try Keycloak JWT
        email = extractEmailFromKeycloakJwt(token);
        if (email != null) {
            logger.debug("Email extracted from Keycloak JWT: {}", email);
            return email;
        }

        return null;
    }

    /**
     * Extract roles from JWT token
     */
    public List<String> extractRolesFromToken(String token) {
        try {
            // JWT format: header.payload.signature
            String[] parts = token.split("\\.");
            if (parts.length != 3) {
                return new ArrayList<>();
            }

            // Decode payload (add padding if needed)
            String payload = parts[1];
            int padding = 4 - (payload.length() % 4);
            if (padding != 4) {
                payload += "=".repeat(padding);
            }

            byte[] decodedBytes = Base64.getUrlDecoder().decode(payload);
            String decodedPayload = new String(decodedBytes);

            // Parse JSON to extract roles
            JsonNode jsonNode = objectMapper.readTree(decodedPayload);

            List<String> roles = new ArrayList<>();

            // Keycloak JWT - look for realm_access.roles
            if (jsonNode.has("realm_access") && jsonNode.get("realm_access").has("roles")) {
                jsonNode.get("realm_access").get("roles").forEach(role -> {
                    roles.add(role.asText());
                });
                logger.debug("Roles extracted from Keycloak JWT: {}", roles);
                return roles;
            }

            // Custom JWT - look for roles array
            if (jsonNode.has("roles")) {
                jsonNode.get("roles").forEach(role -> {
                    roles.add(role.asText());
                });
                logger.debug("Roles extracted from custom JWT: {}", roles);
                return roles;
            }

            return roles;
        } catch (Exception ex) {
            logger.debug("Could not extract roles from JWT: {}", ex.getMessage());
            return new ArrayList<>();
        }
    }

    /**
     * Check if JWT contains specific role
     */
    public boolean hasRole(String token, String role) {
        List<String> roles = extractRolesFromToken(token);
        return roles.contains(role);
    }

    private String extractEmailFromKeycloakJwt(String token) {
        try {
            // JWT format: header.payload.signature
            String[] parts = token.split("\\.");
            if (parts.length != 3) {
                return null;
            }

            // Decode payload (add padding if needed)
            String payload = parts[1];
            int padding = 4 - (payload.length() % 4);
            if (padding != 4) {
                payload += "=".repeat(padding);
            }

            byte[] decodedBytes = Base64.getUrlDecoder().decode(payload);
            String decodedPayload = new String(decodedBytes);

            // Parse JSON to extract email
            JsonNode jsonNode = objectMapper.readTree(decodedPayload);

            // Keycloak uses 'email' claim
            if (jsonNode.has("email")) {
                return jsonNode.get("email").asText();
            }

            // Fallback to 'preferred_username' if email not available
            if (jsonNode.has("preferred_username")) {
                return jsonNode.get("preferred_username").asText();
            }

            return null;
        } catch (Exception ex) {
            logger.debug("Could not extract email from Keycloak JWT: {}", ex.getMessage());
            return null;
        }
    }
}
