package com.perfumeshop.common.config;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.perfumeshop.auth.service.JwtTokenProvider;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Base64;
import java.util.Collection;
import java.util.List;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private static final Logger logger = LoggerFactory.getLogger(JwtAuthenticationFilter.class);

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    private final ObjectMapper objectMapper = new ObjectMapper();

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        try {
            String jwt = extractJwtFromRequest(request);

            if (jwt != null) {
                String email = null;
                Collection<GrantedAuthority> authorities = new ArrayList<>();

                // Try custom JWT validation first (email/password login)
                if (jwtTokenProvider.validateToken(jwt)) {
                    Long userId = jwtTokenProvider.getUserIdFromToken(jwt);
                    email = jwtTokenProvider.getEmailFromToken(jwt);

                    if (userId != null && email != null) {
                        logger.debug("Custom JWT validated for user: {}", email);
                    }
                } else {
                    // Try Keycloak JWT validation (OAuth2 login)
                    email = extractEmailFromKeycloakJwt(jwt);
                    if (email != null) {
                        logger.debug("Keycloak JWT validated for user: {}", email);
                    }
                }

                // Extract roles from JWT (works for both custom and Keycloak JWT)
                if (email != null) {
                    List<String> roles = extractRolesFromToken(jwt);
                    for (String role : roles) {
                        authorities.add(new SimpleGrantedAuthority("ROLE_" + role));
                    }

                    UsernamePasswordAuthenticationToken authentication =
                        new UsernamePasswordAuthenticationToken(email, null, authorities);
                    authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                    SecurityContextHolder.getContext().setAuthentication(authentication);
                    logger.debug("JWT validated for user: {} with roles: {}", email, roles);
                }
            }
        } catch (Exception ex) {
            logger.error("Could not validate JWT: {}", ex.getMessage());
        }

        filterChain.doFilter(request, response);
    }

    private String extractJwtFromRequest(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        if (bearerToken != null && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7);
        }
        return null;
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

    private List<String> extractRolesFromToken(String token) {
        try {
            String[] parts = token.split("\\.");
            if (parts.length != 3) {
                return new ArrayList<>();
            }

            String payload = parts[1];
            int padding = 4 - (payload.length() % 4);
            if (padding != 4) {
                payload += "=".repeat(padding);
            }

            byte[] decodedBytes = Base64.getUrlDecoder().decode(payload);
            String decodedPayload = new String(decodedBytes);
            JsonNode jsonNode = objectMapper.readTree(decodedPayload);

            List<String> roles = new ArrayList<>();

            // Keycloak JWT - realm_access.roles
            if (jsonNode.has("realm_access") && jsonNode.get("realm_access").has("roles")) {
                jsonNode.get("realm_access").get("roles").forEach(role -> roles.add(role.asText()));
            }

            // Custom JWT - roles array
            if (jsonNode.has("roles")) {
                jsonNode.get("roles").forEach(role -> roles.add(role.asText()));
            }

            return roles;
        } catch (Exception ex) {
            logger.debug("Could not extract roles from JWT: {}", ex.getMessage());
            return new ArrayList<>();
        }
    }
}
