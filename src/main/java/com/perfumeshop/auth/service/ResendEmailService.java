package com.perfumeshop.auth.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;

@Service
public class ResendEmailService {

    private static final String RESEND_API_URL = "https://api.resend.com/emails";

    @Autowired
    private RestTemplate restTemplate;

    @Value("${resend.api-key:}")
    private String apiKey;

    @Value("${resend.from-email:noreply@perfumeshop.com}")
    private String fromEmail;

    public ResendEmailService() {
        System.out.println("✓ ResendEmailService bean created - Resend is ENABLED");
    }

    public boolean sendEmail(String to, String subject, String htmlBody, String textBody) {
        try {
            System.out.println("→ Attempting to send email via Resend to: " + to);
            System.out.println("  API Key present: " + (apiKey != null && !apiKey.isEmpty()));
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.set("Authorization", "Bearer " + apiKey);

            Map<String, Object> emailPayload = new HashMap<>();
            emailPayload.put("from", fromEmail);
            emailPayload.put("to", to);
            emailPayload.put("subject", subject);
            emailPayload.put("html", htmlBody);
            if (textBody != null) {
                emailPayload.put("text", textBody);
            }

            ObjectMapper mapper = new ObjectMapper();
            String jsonBody = mapper.writeValueAsString(emailPayload);

            HttpEntity<String> request = new HttpEntity<>(jsonBody, headers);
            var response = restTemplate.postForObject(RESEND_API_URL, request, Map.class);

            System.out.println("Resend API Response: " + response);
            return response != null && response.containsKey("id");
        } catch (Exception e) {
            System.out.println("Error sending email via Resend: " + e.getMessage());
            e.printStackTrace();
            return false;
        }
    }
}
