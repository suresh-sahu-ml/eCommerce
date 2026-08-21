# The Perfume Shop - Frontend Setup Guide

## Overview

This guide provides detailed instructions for setting up, configuring, and running The Perfume Shop frontend client—a production-grade React 18+ SPA built with TypeScript, Vite, and NextUI.

**Project Location:** `/client` directory

## Technology Stack Summary

| Component | Technology | Version |
|-----------|-----------|---------|
| Framework | React | 18.2.0 |
| Build Tool | Vite | 5.0.10 |
| Language | TypeScript | 5.3.3 |
| UI Library | NextUI | 2.6.11 |
| Styling | Tailwind CSS | 3.3.6 |
| State Management | Redux Toolkit | 1.9.7 |
| Authentication | Azure MSAL | 3.12.0 |
| HTTP Client | Axios | 1.6.5 |
| Animations | Framer Motion | 10.16.16 |
| Routing | React Router | 6.20.1 |

## Prerequisites

- **Node.js:** v18.0.0 or higher
- **npm:** 8.0.0 or higher
- **Backend:** Running on `http://localhost:8080` with `/api/v1` endpoints
- **Azure CIAM:** Configured with client credentials

## Quick Start

### 1. Install Dependencies

```bash
cd client
npm install --legacy-peer-deps
```

**Note:** `--legacy-peer-deps` is needed due to NextUI's peer dependency requirements with Framer Motion.

### 2. Configure Environment

```bash
cp .env.example .env
```

Edit `.env` with your Azure CIAM credentials:

```env
VITE_API_URL=http://localhost:8080/api/v1
VITE_AZURE_CLIENT_ID=<your-azure-app-id>
VITE_AZURE_AUTHORITY=https://login.microsoftonline.com/common
VITE_AZURE_REDIRECT_URI=http://localhost:5173
```

### 3. Start Development Server

```bash
npm run dev
```

Open browser: `http://localhost:5173`

## Project Structure

```
client/
├── public/                 # Static assets (favicon, etc.)
├── src/
│   ├── api/
│   │   ├── axiosInstance.ts    # Configured Axios with token interceptor
│   │   ├── catalogApi.ts       # Product fetching API
│   │   └── orderApi.ts         # Order submission API
│   ├── components/
│   │   ├── Navbar.tsx          # Navigation bar with cart & auth
│   │   ├── ProductCard.tsx     # Product grid card component
│   │   ├── FilterSidebar.tsx   # Advanced filtering interface
│   │   └── ProtectedRoute.tsx  # Auth guard for routes
│   ├── config/
│   │   └── msalConfig.ts       # Azure MSAL configuration
│   ├── hooks/
│   │   ├── useAuth.ts          # Authentication hook
│   │   ├── useCatalog.ts       # Product fetching hooks
│   ├── pages/
│   │   ├── HomePage.tsx              # Hero/landing page
│   │   ├── CatalogPage.tsx           # Product grid with filters
│   │   ├── ProductDetailsPage.tsx    # Product detail view
│   │   ├── CheckoutPage.tsx          # Cart & checkout form
│   │   ├── LoginPage.tsx             # Azure login page
│   │   ├── AboutPage.tsx             # Company information
│   │   └── OrderConfirmationPage.tsx # Order success
│   ├── store/
│   │   ├── cartSlice.ts        # Redux cart state
│   │   ├── filterSlice.ts      # Redux filter state
│   │   └── index.ts            # Store configuration
│   ├── styles/
│   │   └── globals.css         # Global styles & Tailwind
│   ├── types/
│   │   └── index.ts            # TypeScript interfaces
│   ├── App.tsx                 # Root component with routing
│   └── main.tsx                # React DOM render entry
├── index.html                  # HTML template
├── vite.config.ts              # Vite configuration
├── tsconfig.json               # TypeScript configuration
├── tailwind.config.js          # Tailwind CSS configuration
├── postcss.config.js           # PostCSS (Tailwind) config
├── .env                        # Environment variables (git-ignored)
├── .env.example                # Environment template
├── package.json                # Dependencies
└── README.md                   # Project documentation
```

## Core Features

### 1. Authentication with Azure CIAM

**Flow:**
1. User clicks "Login" → redirects to Azure login page
2. After authentication, MSAL acquires JWT token
3. All API requests include token via Axios interceptor
4. Token automatically refreshed if expired (silent acquisition)

**Key Files:**
- `src/config/msalConfig.ts` - MSAL configuration
- `src/api/axiosInstance.ts` - Token injection logic
- `src/hooks/useAuth.ts` - Custom auth hook
- `src/components/ProtectedRoute.tsx` - Route protection

### 2. State Management

**Redux (Synchronous UI State):**
- Cart items and drawer open/close
- Filter selections (notes, brands, price range)
- Search query

**API Layer (Asynchronous):**
- Catalog API: Product fetching with parameters
- Order API: Order submission and tracking
- All requests authenticated with Bearer token

**Local Storage:**
- Cart items persist across browser sessions

### 3. Product Catalog

**Features:**
- Responsive grid layout (3 columns desktop, 2 tablet, 1 mobile)
- Advanced filtering: notes (top/heart/base), brand, price range
- Full-text search
- Sort by: name, price, rating
- Pagination support
- Animated card hover effects (Framer Motion)

**Filter Options:**
- **Top Notes:** Citrus, Floral, Woody, Spicy, Fresh, Sweet, Vanilla, Musk
- **Brands:** Chanel, Dior, Guerlain, YSL, Tom Ford, Creed
- **Price Range:** $0-$500

### 4. Checkout Flow

**Steps:**
1. Add products to cart
2. Review cart items
3. Enter delivery information (phone, address)
4. Submit order
5. Receive order confirmation with tracking ID

### 5. Luxury Theme

**Design System:**
- **Colors:**
  - Primary: Warm brown (#b89660)
  - Secondary: Gold (#d4af37)
  - Background: Off-white / Charcoal
  - Accents: Cream (#fffdd0)
  
- **Typography:**
  - Headers: Serif (Playfair Display)
  - Body: Sans-serif (Inter)

- **Dark Mode:** Full support with CSS class strategy

## Available Scripts

```bash
# Development
npm run dev          # Start Vite dev server (port 5173)
npm run type-check   # Run TypeScript type checking
npm run build        # Build for production
npm run preview      # Preview production build locally

# Type Checking
npm run type-check   # Verify TypeScript compilation
```

## API Integration

### Axios Configuration

All requests automatically include:
- `Content-Type: application/json`
- `Authorization: Bearer {JWT_TOKEN}` (acquired from MSAL)
- 10-second timeout
- API base URL: `http://localhost:8080/api/v1`

### Catalog API Endpoints

```typescript
// Fetch paginated products
GET /api/v1/products?page=1&limit=12&topNotes[]=Citrus&brand[]=Chanel&minPrice=0&maxPrice=500

// Fetch single product
GET /api/v1/products/{id}

// Search products
GET /api/v1/products/search?q=Dior

// Fetch by brand
GET /api/v1/products?brand=Chanel
```

### Order API Endpoints

```typescript
// Create order
POST /api/v1/orders
Body: {
  items: [{ productId: "...", quantity: 2 }],
  deliveryAddress: "...",
  phone: "+1234567890"
}

// Fetch order
GET /api/v1/orders/{orderId}

// List user orders
GET /api/v1/orders

// Cancel order
POST /api/v1/orders/{orderId}/cancel
```

## Building for Production

```bash
npm run build
```

Output: `client/dist/` folder

**Build Process:**
1. TypeScript compilation check
2. Vite bundling with code splitting
3. Terser minification
4. Tailwind CSS purging

**Optimization:**
- Lazy route loading
- Tree-shaking of unused code
- CSS minification
- Image optimization (via HTML)

## Troubleshooting

### Issue: "VITE_AZURE_CLIENT_ID is undefined"
**Solution:** Verify `.env` file exists and VITE_ prefix is used (Vite requirement)

### Issue: Styles not loading
**Solution:** Ensure Tailwind CSS is compiled:
```bash
npm run build  # Verifies Tailwind compilation
```

### Issue: "Cannot acquire token silently"
**Solution:** 
- Check Azure CIAM credentials in `.env`
- Verify backend API has CORS enabled
- Check that token scopes are correct in `msalConfig.ts`

### Issue: 401 Unauthorized on API calls
**Solution:** 
- Verify user is logged in (check localStorage for tokens)
- Check JWT token expiration
- Verify backend is validating tokens correctly

### Issue: Cart not persisting
**Solution:** 
- Check browser localStorage is not disabled
- Verify browser dev tools → Application → Storage

## Environment-Specific Configuration

### Development
```env
VITE_API_URL=http://localhost:8080/api/v1
VITE_AZURE_CLIENT_ID=local-client-id
```

### Staging
```env
VITE_API_URL=https://staging-api.perfumeshop.com/api/v1
VITE_AZURE_CLIENT_ID=staging-client-id
```

### Production
```env
VITE_API_URL=https://api.perfumeshop.com/api/v1
VITE_AZURE_CLIENT_ID=prod-client-id
```

## Performance Metrics

**Target Metrics:**
- First Contentful Paint (FCP): < 2.0s
- Largest Contentful Paint (LCP): < 2.5s
- Cumulative Layout Shift (CLS): < 0.1
- Time to Interactive (TTI): < 3.5s

**Optimizations Applied:**
- Code splitting at route level
- Lazy loading of components
- Image optimization recommendations
- Redux selectors prevent unnecessary re-renders
- Framer Motion GPU-accelerated animations

## Security

### HTTPS Only
- Redirect HTTP to HTTPS in production
- Secure cookies with HttpOnly flag

### CORS
- Backend must allow frontend origin in CORS headers
- Token scope limited to API resource

### XSS Prevention
- React escapes JSX by default
- No `dangerouslySetInnerHTML` usage
- Axios sanitizes request/response

### CSRF Protection
- Automatic CSRF token handling via MSAL
- SameSite cookie policy

## Deployment

### To Vercel
```bash
# Auto-detects vite.config.ts
vercel
```

### To Netlify
```bash
# Build command: npm run build
# Publish directory: dist
netlify deploy
```

### To AWS S3 + CloudFront
```bash
npm run build
aws s3 sync dist/ s3://perfume-shop-bucket --delete
aws cloudfront create-invalidation --distribution-id E123ABC --paths "/*"
```

## Development Workflow

### Adding a New Page

1. Create page component in `src/pages/PageName.tsx`
2. Add route in `src/App.tsx`:
```typescript
<Route path="/page-name" element={<PageName />} />
```
3. Link from navigation or other pages
4. Add to Navbar if top-level navigation

### Adding a New API Endpoint

1. Add method to `src/api/catalogApi.ts` or `src/api/orderApi.ts`
2. Create custom hook in `src/hooks/` if complex logic needed
3. Use in component with try-catch error handling

### Adding Redux State

1. Create slice in `src/store/newSlice.ts`
2. Import and add to `configureStore()` in `src/store/index.ts`
3. Use `useAppDispatch` and `useAppSelector` in components

## Testing Recommendations

### Unit Tests
```bash
# Not configured yet; consider adding:
npm install --save-dev @testing-library/react @testing-library/jest-dom vitest
```

### E2E Tests
```bash
# Consider adding:
npm install --save-dev @playwright/test cypress
```

### Manual Testing Checklist
- [ ] Desktop (Chrome, Firefox, Safari)
- [ ] Tablet (iPad, Android tablet)
- [ ] Mobile (iPhone, Android phone)
- [ ] Dark/Light mode toggle
- [ ] Login/Logout flow
- [ ] Add to cart → Checkout
- [ ] Responsive design at all breakpoints
- [ ] API errors gracefully handled

## Monitoring & Analytics

### Recommended Services
- **Error Tracking:** Sentry
- **Analytics:** Google Analytics
- **Performance:** Vercel Analytics or Datadog
- **User Monitoring:** LogRocket

### Adding Sentry
```typescript
// src/main.tsx
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN,
  environment: import.meta.env.MODE,
});
```

## Next Steps

1. **Configure Azure CIAM** with client credentials
2. **Update `.env`** with actual backend URL and Azure IDs
3. **Test authentication** flow
4. **Review catalog** filtering and search
5. **Test checkout** with mock orders
6. **Performance optimization** (images, code splitting)
7. **Setup monitoring** (error tracking, analytics)
8. **Deploy** to staging environment

## Support & Documentation

- [React 18 Docs](https://react.dev)
- [Vite Guide](https://vitejs.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS](https://tailwindcss.com)
- [NextUI Components](https://nextui.org)
- [Redux Toolkit](https://redux-toolkit.js.org)
- [Azure MSAL](https://learn.microsoft.com/en-us/azure/active-directory/develop/msal-overview)

## Contributing

Follow these guidelines:

1. **TypeScript:** Maintain strict mode compliance
2. **Components:** Keep components small and focused
3. **State:** Use Redux for UI, API layer for server state
4. **Styling:** Use Tailwind utilities, avoid custom CSS
5. **Testing:** Write tests for complex logic
6. **Performance:** Profile with DevTools before optimizing

## License

Proprietary - The Perfume Shop © 2024
