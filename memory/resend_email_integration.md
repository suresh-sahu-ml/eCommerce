---
name: resend_email_integration
description: Resend SMTP email service integration for signup verification
metadata:
  type: project
---

## Resend Email Integration Complete

**Status:** Configured and ready to use

**Setup:** To activate Resend emails on signup verification:
1. Get API key from https://resend.com (free account)
2. Add to `.env` file:
   - `RESEND_ENABLED=true`
   - `RESEND_API_KEY=re_xxxxx` (your actual key)
   - `RESEND_FROM_EMAIL=noreply@perfumeshop.com`
3. Restart backend: `./gradlew bootRun`
4. Test via signup page

**Key Files:**
- `src/main/java/com/perfumeshop/auth/service/ResendEmailService.java` - REST API integration
- `src/main/java/com/perfumeshop/auth/service/EmailService.java` - Email sender logic
- `src/main/resources/application.yml` - Configuration
- `.env` - Environment variables (git-ignored)

**Architecture:** Uses Resend REST API (https://api.resend.com/emails) via RestTemplate. Falls back to JavaMailSender or console logging if Resend disabled/unavailable.

**Verification Email:** Beautiful HTML template with 6-digit code, 15-min expiry, professional branding

**Documentation:**
- `RESEND_QUICK_START.md` - 5-minute setup guide
- `RESEND_SETUP_GUIDE.md` - Comprehensive guide with troubleshooting
