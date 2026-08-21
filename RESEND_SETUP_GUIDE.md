# Resend Email Integration Setup Guide

This guide will help you set up Resend email service for The Perfume Shop's sign-up verification emails.

## Overview

The application now supports sending verification emails via Resend, a modern email service provider. When users sign up, they'll receive a verification code via email.

## Prerequisites

1. **Resend Account**: Sign up for a free account at [resend.com](https://resend.com)
2. **Verified Domain** (optional but recommended for production):
   - You can use Resend's test domain initially
   - For production, verify your own domain in Resend dashboard

## Step-by-Step Setup

### 1. Create Resend Account

- Visit [resend.com](https://resend.com) and sign up for a free account
- Verify your email address

### 2. Get API Key

- Log in to your Resend dashboard
- Go to **API Keys** section
- Click **Create API Key**
- Copy the generated API key (starts with `re_`)

### 3. Configure Your Environment

#### For Local Development:

1. Open or create `.env` file in the project root
2. Add the following configuration:

```env
RESEND_ENABLED=true
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxxxxxxxxx
RESEND_FROM_EMAIL=noreply@perfumeshop.com
```

Replace `re_xxxxxxxxxxxxxxxxxxxxxxxxxxxx` with your actual Resend API key.

#### For Production:

1. Set environment variables in your deployment environment (Docker, Kubernetes, Cloud Platform)
2. Ensure `RESEND_ENABLED=true`
3. Use a verified domain email address for `RESEND_FROM_EMAIL`

### 4. Verify Email Sender

**For Testing (Resend Test Domain):**
- The default `noreply@perfumeshop.com` will work with Resend's test domain
- Emails can only be sent to emails registered in your Resend account initially

**For Production:**
1. Verify your custom domain in Resend:
   - Go to Resend Dashboard → Domains
   - Click "Add Domain"
   - Follow the DNS configuration instructions
   - Update `RESEND_FROM_EMAIL` to use your verified domain

### 5. Start the Application

```bash
# For development
./gradlew bootRun

# Or build and run
./gradlew build
java -jar build/libs/perfume-shop-1.0.0.jar
```

The application will automatically load environment variables from `.env` file.

### 6. Test the Integration

1. Navigate to the sign-up page: `http://localhost:3000/signup`
2. Fill in the registration form with valid details
3. Submit the form
4. Check your email for the verification code
5. Enter the verification code on the verification page

## Architecture

### Email Flow

```
1. User Signs Up (SignupPage.jsx)
   ↓
2. authService.signup() calls backend API
   ↓
3. AuthController → AuthService → VerificationService
   ↓
4. VerificationService.createVerification()
   ↓
5. EmailService.sendOtpEmail()
   ├─→ If Resend Enabled: Send via Resend API
   ├─→ Else if JavaMailSender available: Send via SMTP
   └─→ Else: Log OTP to console
   ↓
6. User receives verification email
```

### Configuration Priority

1. **Resend** (if `RESEND_ENABLED=true` and API key is set)
2. **JavaMailSender** (if configured via Spring Mail properties)
3. **Console Logging** (fallback, logs OTP to console)

## Key Files

- **Backend Service**: `src/main/java/com/perfumeshop/auth/service/EmailService.java`
- **Config**: `src/main/java/com/perfumeshop/auth/config/ResendConfig.java`
- **Settings**: `src/main/resources/application.yml`
- **Environment**: `.env` (create from `.env.example`)

## Email Template

The verification email includes:
- Welcome message
- 6-digit verification code (large, easy to read)
- 15-minute expiry warning
- Professional styling with The Perfume Shop branding

## Troubleshooting

### Email Not Received

1. **Check API Key**: Verify it starts with `re_` and is correct
2. **Check RESEND_ENABLED**: Must be set to `true`
3. **Check Email Address**: 
   - For testing, use an email registered in your Resend account
   - For production, ensure sender domain is verified
4. **Check Logs**: Look for error messages in application console

### "Invalid API Key" Error

- Copy your API key again from Resend dashboard
- Ensure it's set correctly in `.env`: `RESEND_API_KEY=re_xxxxx`
- No quotes needed around the key
- Restart the application after changing `.env`

### Emails Going to Spam

1. Verify your domain in Resend
2. Set up SPF, DKIM, and DMARC records (Resend provides these)
3. Use a recognizable sender name/email
4. Ensure email content is legitimate

## Spring Mail Fallback (Optional)

If you want to keep Spring Mail as fallback without Resend:

1. Add to `application.yml`:
```yaml
spring:
  mail:
    host: smtp.gmail.com
    port: 587
    username: your-email@gmail.com
    password: your-app-password
    properties:
      mail:
        smtp:
          auth: true
          starttls:
            enable: true
            required: true
```

2. Set `RESEND_ENABLED=false` to use Spring Mail instead

## Cost Considerations

- **Resend**: 100 emails/day free tier, then affordable pricing
- **Spring Mail**: Requires your own SMTP server or third-party provider

## Next Steps

1. [Optional] Set up custom domain verification for production
2. [Optional] Configure email templates in Resend dashboard
3. Test the complete sign-up and verification flow
4. Deploy to your environment

## Support

For Resend issues:
- Resend Documentation: https://resend.com/docs
- Resend Support: https://resend.com/support

For application issues:
- Check application logs: `logs/perfume-shop.log`
- Verify `.env` configuration is correct
