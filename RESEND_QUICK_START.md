# Resend Email Setup - Quick Start

Get your sign-up page sending verification emails in 5 minutes!

## 1. Get Resend API Key

1. Go to https://resend.com
2. Sign up for free account
3. Go to API Keys → Create API Key
4. Copy the key (starts with `re_`)

## 2. Add to .env File

In the project root, create/edit `.env` file:

```
RESEND_ENABLED=true
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxxxxxxxxx
RESEND_FROM_EMAIL=noreply@perfumeshop.com
```

Replace with your actual API key.

## 3. Start Backend

```bash
cd /path/to/The-Perfume-Shop
./gradlew bootRun
```

Or if using Windows:
```bash
gradlew.bat bootRun
```

## 4. Start Frontend

```bash
cd client
npm run dev
```

## 5. Test Sign-Up Flow

1. Open http://localhost:5173/signup
2. Fill in registration form
3. Submit
4. Check your email for 6-digit verification code
5. Enter code on verification page

## 6. Troubleshooting

**"Email not received?"**
- Check API key is correct (starts with `re_`)
- Check RESEND_ENABLED is `true`
- Verify backend console shows "Email sent successfully via Resend"

**"Check backend logs"**
```
tail -f startup_full.log | grep -i "resend\|email"
```

**"Still not working?"**
- Fall back to console logging by setting `RESEND_ENABLED=false`
- Check Resend dashboard for any errors

## Configuration Details

| Variable | Default | Required |
|----------|---------|----------|
| RESEND_ENABLED | false | Yes* |
| RESEND_API_KEY | (empty) | Yes* |
| RESEND_FROM_EMAIL | noreply@perfumeshop.com | No |

*Required if you want to use Resend

## Email Flow in Code

```
SignupPage.jsx (Frontend)
    ↓ authService.signup()
    ↓ POST /api/auth/signup
AuthController.java
    ↓ authService.signup()
AuthService.java
    ↓ verificationService.createVerification()
VerificationService.java
    ↓ emailService.sendOtpEmail()
EmailService.java
    ├─ ResendEmailService (if RESEND_ENABLED=true)
    │    ↓ POST https://api.resend.com/emails
    │    ↓ User receives email ✓
    │
    └─ Fallback: Console log (if Resend disabled)
```

## File Changes

New files:
- `.env` - Configuration
- `RESEND_SETUP_GUIDE.md` - Detailed setup
- `src/main/java/.../ResendEmailService.java` - Resend integration

Updated files:
- `src/main/resources/application.yml` - Added Resend config
- `src/main/java/.../EmailService.java` - Uses ResendEmailService
- `build.gradle` - Dependencies (unchanged, REST API only)

## Next Steps

1. ✅ Set RESEND_ENABLED=true and add API key
2. ✅ Start app and test sign-up
3. 📋 For production, verify your domain in Resend
4. 📋 Use professional sender email (e.g., noreply@yourdomain.com)

**Need help?** See `RESEND_SETUP_GUIDE.md` for detailed instructions
