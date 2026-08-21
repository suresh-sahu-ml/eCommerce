package com.perfumeshop.contact.controller;

import com.perfumeshop.contact.dto.ContactMessageRequest;
import com.perfumeshop.contact.entity.ContactMessage;
import com.perfumeshop.contact.repository.ContactMessageRepository;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/contact")
@CrossOrigin(origins = "http://localhost:3000")
public class ContactController {

    private static final Logger logger = LoggerFactory.getLogger(ContactController.class);

    @Autowired
    private ContactMessageRepository contactMessageRepository;

    @PostMapping
    public ResponseEntity<?> submitContactMessage(@Valid @RequestBody ContactMessageRequest request) {
        try {
            logger.info("Received contact message from: {}", request.getEmail());

            ContactMessage message = new ContactMessage(
                request.getName(),
                request.getEmail(),
                request.getSubject(),
                request.getMessage()
            );

            ContactMessage savedMessage = contactMessageRepository.save(message);
            logger.info("Contact message saved with ID: {}", savedMessage.getMessageId());

            Map<String, String> response = new HashMap<>();
            response.put("message", "Thank you for contacting us. We will get back to you shortly.");
            response.put("messageId", savedMessage.getMessageId().toString());

            return ResponseEntity.status(HttpStatus.CREATED).body(response);

        } catch (Exception e) {
            logger.error("Error processing contact message", e);
            Map<String, String> error = new HashMap<>();
            error.put("error", "Failed to process your request");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }
}
