package com.perfumeshop.auth.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired(required = false)
    private JavaMailSender mailSender;

    @Autowired(required = false)
    private ResendEmailService resendEmailService;

    @Value("${resend.enabled:false}")
    private boolean resendEnabled;

    public void sendOtpEmail(String email, String code) {
        System.out.println("\n=== EMAIL SERVICE DEBUG ===");
        System.out.println("resendEnabled: " + resendEnabled);
        System.out.println("resendEmailService available: " + (resendEmailService != null));
        System.out.println("mailSender available: " + (mailSender != null));

        if (resendEnabled && resendEmailService != null) {
            System.out.println("→ Using RESEND");
            sendViaResend(email, code);
        } else if (mailSender != null) {
            System.out.println("→ Using JAVA MAIL SENDER");
            sendViaJavaMailSender(email, code);
        } else {
            System.out.println("→ Falling back to CONSOLE LOGGING");
            logOtp(email, code, "EMAIL");
        }
        System.out.println("===========================\n");
    }

    private void sendViaResend(String email, String code) {
        boolean sent = resendEmailService.sendEmail(
            email,
            "Your Verification Code - The Perfume Shop",
            buildHtmlEmailContent(code),
            buildEmailContent(code)
        );
        if (sent) {
            System.out.println("Email sent successfully via Resend to: " + email);
        } else {
            System.out.println("Failed to send email via Resend to: " + email);
            logOtp(email, code, "RESEND_FAILED");
        }
    }

    private void sendViaJavaMailSender(String email, String code) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(email);
            message.setSubject("Your Verification Code - The Perfume Shop");
            message.setText(buildEmailContent(code));
            message.setFrom("noreply@perfumeshop.com");

            mailSender.send(message);
            System.out.println("Email sent successfully via JavaMailSender to: " + email);
        } catch (Exception e) {
            System.out.println("Failed to send email via JavaMailSender to " + email + ": " + e.getMessage());
            logOtp(email, code, "EMAIL");
        }
    }

    public void sendOtpSms(String phoneNumber, String code) {
        logOtp(phoneNumber, code, "SMS");
    }

    private void logOtp(String contact, String code, String type) {
        System.out.println("================================");
        System.out.println(type + " OTP Code: " + code);
        System.out.println("Recipient: " + maskContact(contact, type));
        System.out.println("Expires in: 15 minutes");
        System.out.println("================================");
    }

    private String maskContact(String contact, String type) {
        if ("EMAIL".equals(type)) {
            int atIndex = contact.indexOf('@');
            if (atIndex > 2) {
                return contact.substring(0, 2) + "***" + contact.substring(atIndex - 1);
            }
        } else if ("SMS".equals(type)) {
            if (contact.length() >= 4) {
                return "***" + contact.substring(contact.length() - 4);
            }
        }
        return contact;
    }

    private String buildEmailContent(String code) {
        return "Your verification code is: " + code + "\n\n" +
               "This code will expire in 15 minutes.\n\n" +
               "If you didn't request this code, please ignore this email.\n\n" +
               "The Perfume Shop Team";
    }

    private String buildHtmlEmailContent(String code) {
        return "<div style=\"font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;\">" +
            "<div style=\"background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px; text-align: center; border-radius: 10px 10px 0 0;\">" +
            "<h1 style=\"color: white; margin: 0; font-size: 24px;\">The Perfume Shop</h1>" +
            "<p style=\"color: rgba(255,255,255,0.9); margin: 8px 0 0 0;\">Email Verification</p>" +
            "</div>" +
            "<div style=\"background: #f9f9f9; padding: 40px; border-radius: 0 0 10px 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);\">" +
            "<p style=\"color: #333; font-size: 16px; margin: 0 0 24px 0;\">Welcome to The Perfume Shop!</p>" +
            "<p style=\"color: #666; font-size: 14px; margin: 0 0 24px 0;\">To verify your email address and complete your registration, please use the code below:</p>" +
            "<div style=\"background: white; padding: 20px; border-radius: 8px; text-align: center; margin: 24px 0;\">" +
            "<p style=\"font-size: 32px; font-weight: bold; color: #667eea; letter-spacing: 4px; margin: 0;\">" + code + "</p>" +
            "</div>" +
            "<p style=\"color: #666; font-size: 12px; margin: 24px 0 0 0; text-align: center;\">This code will expire in <strong>15 minutes</strong>.</p>" +
            "<p style=\"color: #999; font-size: 12px; margin: 12px 0 0 0; text-align: center;\">If you didn't request this code, please ignore this email.</p>" +
            "</div>" +
            "<div style=\"background: #f0f0f0; padding: 20px; text-align: center; border-radius: 0 0 10px 10px;\">" +
            "<p style=\"color: #999; font-size: 11px; margin: 0;\">&copy; 2025 The Perfume Shop. All rights reserved.</p>" +
            "</div>" +
            "</div>";
    }
}
