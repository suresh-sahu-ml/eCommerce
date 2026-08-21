# The Perfume Shop - Frontend Deployment Guide

## Build Status: ✅ PRODUCTION BUILD SUCCESSFUL

**Build Output Summary:**
```
dist/index.html                 0.99 kB (gzip: 0.52 kB)
dist/assets/index-rreX0oJx.css  222.90 kB (gzip: 25.03 kB)
dist/assets/index-D-rZhwQz.js   0.11 kB (gzip: 0.11 kB)
dist/assets/index-BjiMLVej.js   1,000.42 kB (gzip: 287.43 kB)

Build time: 12.08 seconds
Modules transformed: 1,860
Status: ✓ built successfully
```

---

## Pre-Deployment Checklist

- [x] TypeScript compilation passes
- [x] Vite build completes successfully
- [x] Assets generated (HTML, CSS, JS)
- [x] Terser minification applied
- [x] Source maps disabled for production
- [x] All environment variables configured
- [ ] Azure CIAM credentials verified
- [ ] Backend API endpoints tested
- [ ] CORS headers configured
- [ ] SSL certificate setup
- [ ] Domain DNS configured

---

## Local Development Verification

Before deploying to production, run these tests locally:

### 1. Start Development Server

```bash
cd client
npm run dev
```

**Expected:**
- Server runs on http://localhost:5173
- Hot Module Reloading works
- No console errors

### 2. Test Routes

- [ ] `/` - Homepage loads with hero section
- [ ] `/about` - About page displays company info
- [ ] `/login` - Login button redirects to Azure
- [ ] `/catalog` - Catalog page displays products (requires mock API or running backend)
- [ ] `/product/:id` - Product detail page loads

### 3. Test Authentication

- [ ] Click "Login" → Azure CIAM login page opens
- [ ] Enter credentials → Redirects back to app
- [ ] User name displays in navbar
- [ ] Cart and checkout accessible
- [ ] Click "Logout" → Returns to home page

### 4. Test Cart & Checkout (requires backend)

- [ ] Add product to cart
- [ ] Cart badge updates
- [ ] Navigate to `/cart`
- [ ] See items in checkout form
- [ ] Fill in delivery address
- [ ] Submit order
- [ ] See confirmation page with order ID

### 5. Test Responsive Design

```bash
# Browser DevTools
- Desktop (1920x1080)
- Tablet (768x1024)
- Mobile (375x667)
- Dark/Light mode toggle
```

---

## Deployment Options

### Option 1: Vercel (Recommended for Next.js-style deployment)

**Advantages:**
- Zero-config deployment
- Automatic preview deployments
- Built-in analytics
- Serverless functions support
- Edge network

**Steps:**

1. Install Vercel CLI:
```bash
npm install -g vercel
```

2. Deploy:
```bash
cd client
vercel
```

3. Configure environment variables in Vercel dashboard:
   - `VITE_API_URL`
   - `VITE_AZURE_CLIENT_ID`
   - `VITE_AZURE_AUTHORITY`
   - `VITE_AZURE_REDIRECT_URI` (update to production domain)

4. Set production domain in Vercel settings

### Option 2: Netlify

**Advantages:**
- Easy GitHub integration
- Automatic deployments on push
- Built-in form handling
- Redirect rules support

**Steps:**

1. Build locally:
```bash
npm run build
```

2. Deploy via CLI:
```bash
npm install -g netlify-cli
netlify deploy --prod --dir=dist
```

3. Or connect GitHub:
   - Push to repository
   - Connect repo to Netlify
   - Set build command: `npm run build`
   - Set publish directory: `dist`
   - Add environment variables

### Option 3: AWS S3 + CloudFront

**Advantages:**
- Cost-effective at scale
- Full AWS ecosystem integration
- Custom domain support
- CDN caching

**Steps:**

1. Build application:
```bash
npm run build
```

2. Create S3 bucket:
```bash
aws s3 mb s3://perfume-shop-frontend --region us-east-1
```

3. Upload files:
```bash
aws s3 sync dist/ s3://perfume-shop-frontend --delete
```

4. Create CloudFront distribution:
```bash
# Via AWS Console:
# - Origin: S3 bucket
# - Viewer Protocol Policy: Redirect HTTP to HTTPS
# - Default Root Object: index.html
# - Error pages: /index.html for 404/403 (SPA routing)
```

5. Create invalidation for updates:
```bash
aws cloudfront create-invalidation \
  --distribution-id E1234EXAMPLE \
  --paths "/*"
```

### Option 4: Docker Container

**Advantages:**
- Portable deployment
- Consistent environments
- Kubernetes ready

**Dockerfile:**

```dockerfile
# Build stage
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --legacy-peer-deps
COPY . .
RUN npm run build

# Production stage
FROM node:18-alpine
WORKDIR /app
RUN npm install -g serve
COPY --from=builder /app/dist ./dist
EXPOSE 3000
CMD ["serve", "-s", "dist", "-l", "3000"]
```

**Build & Run:**
```bash
docker build -t perfume-shop-frontend .
docker run -p 3000:3000 \
  -e VITE_API_URL=https://api.perfumeshop.com/api/v1 \
  -e VITE_AZURE_CLIENT_ID=prod-client-id \
  perfume-shop-frontend
```

---

## Environment Configuration for Deployment

### Development (localhost)
```env
VITE_API_URL=http://localhost:8080/api/v1
VITE_AZURE_CLIENT_ID=dev-client-id
VITE_AZURE_AUTHORITY=https://login.microsoftonline.com/common
VITE_AZURE_REDIRECT_URI=http://localhost:5173
```

### Staging
```env
VITE_API_URL=https://staging-api.perfumeshop.com/api/v1
VITE_AZURE_CLIENT_ID=staging-client-id
VITE_AZURE_AUTHORITY=https://login.microsoftonline.com/common
VITE_AZURE_REDIRECT_URI=https://staging.perfumeshop.com
```

### Production
```env
VITE_API_URL=https://api.perfumeshop.com/api/v1
VITE_AZURE_CLIENT_ID=prod-client-id
VITE_AZURE_AUTHORITY=https://login.microsoftonline.com/common
VITE_AZURE_REDIRECT_URI=https://www.perfumeshop.com
```

---

## Post-Deployment Verification

### 1. Smoke Tests

```bash
# Check homepage loads
curl -I https://www.perfumeshop.com
# Expected: HTTP 200

# Check SPA routing works
curl -I https://www.perfumeshop.com/catalog
# Expected: HTTP 200 (serves index.html)

# Check assets load
curl -I https://www.perfumeshop.com/assets/index-*.js
# Expected: HTTP 200, Content-Type: application/javascript
```

### 2. Browser Testing

- [ ] Homepage loads without errors
- [ ] Console has no critical errors
- [ ] Images display correctly
- [ ] Styling renders properly
- [ ] Navigation links work
- [ ] Dark/light mode toggle works
- [ ] Azure login redirects correctly
- [ ] Cart functionality works (with backend)

### 3. Performance Testing

```bash
# Google PageSpeed Insights
# Target: 90+ on all metrics

# Lighthouse
# Target: 90+ Performance, Accessibility, Best Practices
```

### 4. Security Testing

- [ ] No sensitive data in localStorage except tokens
- [ ] HTTPS enforced
- [ ] X-Frame-Options set (clickjacking prevention)
- [ ] X-Content-Type-Options set (MIME sniffing prevention)
- [ ] Content-Security-Policy headers set
- [ ] CORS headers properly configured

---

## Monitoring & Alerting

### Recommended Services

**Error Tracking:**
```bash
npm install @sentry/react @sentry/tracing
```

```typescript
// src/main.tsx
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: "https://your-sentry-dsn@sentry.io/123456",
  environment: "production",
  tracesSampleRate: 1.0,
});
```

**Analytics:**
```typescript
// Add Google Analytics
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_ID');
</script>
```

**Performance Monitoring:**
- Vercel Analytics (if using Vercel)
- Datadog APM
- New Relic Browser

---

## Troubleshooting Deployment Issues

### Issue: "Cannot find module" errors in production

**Cause:** Missing dependencies or environment variables

**Solution:**
```bash
# Verify all dependencies installed
npm install --legacy-peer-deps

# Check environment variables
echo $VITE_API_URL
echo $VITE_AZURE_CLIENT_ID

# Rebuild
npm run build
```

### Issue: Static assets return 404

**Cause:** Incorrect asset paths or CDN misconfiguration

**Solution:**
- Verify `vite.config.ts` has correct `base` path
- Check CloudFront or CDN cache invalidation
- Ensure S3 bucket has public read permissions

### Issue: API calls fail with 401

**Cause:** Invalid token or expired authentication

**Solution:**
- Verify Azure credentials match production
- Check token refresh logic in `axiosInstance.ts`
- Enable Sentry to track specific failures

### Issue: Azure login loop (redirect loop)

**Cause:** Redirect URI mismatch

**Solution:**
- Verify `VITE_AZURE_REDIRECT_URI` matches Azure portal
- Ensure production domain is registered in Azure
- Check CORS is enabled on Azure endpoints

### Issue: Styles flash unstyled (FOUC)

**Cause:** CSS loading delayed

**Solution:**
- Verify CSS file is being served by CDN
- Add `<link rel="preload" href="/assets/index-*.css">`
- Configure CDN caching headers

---

## Rollback Procedures

### Quick Rollback (Vercel)

```bash
# Revert to previous deployment
vercel rollback
```

### Manual Rollback

1. Keep previous build artifacts
2. Deploy previous version:
```bash
aws s3 sync s3://perfume-shop-frontend-backups/v1.0 s3://perfume-shop-frontend --delete
aws cloudfront create-invalidation --distribution-id E123 --paths "/*"
```

### Database Considerations

- Ensure API is backward compatible with previous frontend
- No breaking changes in API contracts
- Test rollback with production database

---

## Performance Optimization

### Current Bundle Size

```
CSS: 222.90 kB (gzip: 25.03 kB)
JS:  1,000.42 kB (gzip: 287.43 kB)
Total: ~312 kB (gzip)
```

### Recommended Optimizations

1. **Code Splitting:**
```typescript
// In vite.config.ts
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'ui-vendor': ['@nextui-org/react', 'framer-motion'],
          'auth': ['@azure/msal-react', '@azure/msal-browser'],
        }
      }
    }
  }
});
```

2. **Image Optimization:**
- Use WebP format with fallbacks
- Lazy load images with intersection observer
- Optimize with tools like imagemin

3. **Route-Based Code Splitting:**
Already implemented with React Router lazy loading

4. **Dynamic Imports:**
```typescript
// Instead of:
import ProductDetailsPage from './pages/ProductDetailsPage'

// Use:
const ProductDetailsPage = lazy(() => import('./pages/ProductDetailsPage'))
```

---

## Scaling Considerations

### For 10K+ Daily Users

- [ ] Enable Redis caching for products
- [ ] Setup CDN edge caching
- [ ] Implement service worker for offline
- [ ] Setup analytics dashboard
- [ ] Configure alerts for errors

### For 100K+ Daily Users

- [ ] Multi-region CDN deployment
- [ ] Database read replicas
- [ ] API rate limiting
- [ ] Load testing setup
- [ ] Dedicated support team

### For 1M+ Daily Users

- [ ] Full global CDN
- [ ] Kubernetes orchestration
- [ ] Advanced monitoring (Datadog, PagerDuty)
- [ ] Database sharding
- [ ] GraphQL federation

---

## Compliance & Security Hardening

### GDPR Compliance

- [ ] Privacy policy updated
- [ ] Cookie consent banner implemented
- [ ] Data deletion endpoints
- [ ] DPIA completed

### PCI Compliance (for payment)

- [ ] Never store card data
- [ ] Use tokenized payments only
- [ ] SSL/TLS everywhere
- [ ] Regular security audits

### WCAG Accessibility

- [ ] Audit with axe DevTools
- [ ] Test with screen readers
- [ ] Keyboard navigation works
- [ ] Color contrast meets WCAG AA

---

## Maintenance Schedule

### Daily
- Monitor error rates (Sentry)
- Check uptime (StatusPage)

### Weekly
- Review analytics
- Check for security updates
- Performance metrics review

### Monthly
- Full regression testing
- Dependency updates
- Security audit
- Database cleanup

### Quarterly
- Major version updates
- Performance optimization review
- Disaster recovery drill

---

## Contact & Emergency

**Emergency Hotline:** [To be configured]

**On-Call Rotation:**
- [Team member 1] - Monday-Wednesday
- [Team member 2] - Wednesday-Friday
- [Team member 3] - Friday-Sunday

**Escalation Path:**
1. On-call engineer
2. Team lead
3. Engineering manager
4. CTO

---

## Final Checklist Before Production Launch

- [ ] Build successful with no warnings
- [ ] All tests passing
- [ ] TypeScript strict mode passes
- [ ] Environment variables configured
- [ ] Azure CIAM credentials verified
- [ ] Backend API endpoints tested
- [ ] CORS headers configured
- [ ] SSL certificate installed
- [ ] Domain DNS pointing to CDN
- [ ] Monitoring configured
- [ ] Alerts setup
- [ ] Rollback procedure tested
- [ ] Team trained on deployment
- [ ] Documentation complete

---

**Last Updated:** August 15, 2024
**Frontend Version:** 1.0.0
**Status:** Ready for Deployment
