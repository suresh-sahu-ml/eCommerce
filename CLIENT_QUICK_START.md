# The Perfume Shop - Client Quick Start

> **Status:** ✅ Production build successful | Ready for integration testing

## Get Started in 3 Minutes

### 1. Install & Configure

```bash
cd client
npm install --legacy-peer-deps
cp .env.example .env
# Edit .env with your Azure CIAM credentials
```

### 2. Run Development Server

```bash
npm run dev
# Open http://localhost:5173
```

### 3. Build for Production

```bash
npm run build
# Output: client/dist/
```

---

## What You Get

### Architecture
- ✅ React 18 + TypeScript (strict mode)
- ✅ Vite (ultra-fast dev/build)
- ✅ Redux Toolkit (state management)
- ✅ Tailwind CSS (utility styling)
- ✅ NextUI (component library)
- ✅ Axios (HTTP client)
- ✅ Azure MSAL (authentication)
- ✅ React Router (navigation)
- ✅ Framer Motion (animations)

### Pages & Features
- **Home** - Hero landing page
- **Catalog** - Product grid with advanced filtering (notes, brand, price, search)
- **Product Details** - Full product information with image
- **Cart & Checkout** - Order form with delivery info
- **Order Confirmation** - Success page with order ID
- **About** - Company information
- **Login** - Azure CIAM authentication

### Key Capabilities
- 🔐 Secure JWT-based authentication
- 🛒 Shopping cart with localStorage persistence
- 🔍 Advanced product filtering
- 📱 Fully responsive design
- 🌓 Dark/light mode
- ✨ Smooth animations
- 🚀 Production-optimized build

---

## Development Workflow

### Add a New Page

```bash
# 1. Create component
touch src/pages/NewPage.tsx

# 2. Add to App.tsx routing
<Route path="/new-page" element={<NewPage />} />

# 3. Link from navbar or other pages
<Link to="/new-page">Go to New Page</Link>
```

### Modify Redux State

```bash
# 1. Update store/cartSlice.ts or create new slice
# 2. Add to store/index.ts configureStore()
# 3. Use in component:
const dispatch = useAppDispatch();
const state = useAppSelector(state => state.cart);
dispatch(addToCart(item));
```

### Call Backend API

```bash
# 1. Add method to src/api/catalogApi.ts or orderApi.ts
# 2. Create custom hook if complex
# 3. Use in component with try-catch

const { products, loading, error } = useCatalog(params);
```

---

## Project Structure

```
client/
├── src/
│   ├── api/              # Axios instance + API endpoints
│   ├── components/       # Reusable UI components
│   ├── config/           # MSAL configuration
│   ├── hooks/            # Custom React hooks
│   ├── pages/            # Page components
│   ├── store/            # Redux slices
│   ├── styles/           # Global CSS
│   ├── types/            # TypeScript interfaces
│   ├── App.tsx           # Root + routing
│   └── main.tsx          # Entry point
├── public/               # Static assets
├── .env                  # Environment variables
├── vite.config.ts        # Vite config
├── tsconfig.json         # TypeScript config
├── tailwind.config.js    # Tailwind config
├── package.json          # Dependencies
└── README.md             # Full documentation
```

---

## Key Files to Know

| File | Purpose |
|------|---------|
| `src/App.tsx` | Routes, layout, Redux/MSAL setup |
| `src/api/axiosInstance.ts` | Token injection logic |
| `src/store/index.ts` | Redux configuration |
| `src/config/msalConfig.ts` | Azure CIAM setup |
| `.env` | Environment variables |
| `vite.config.ts` | Dev server + build config |
| `tailwind.config.js` | Luxury theme colors |

---

## Common Tasks

### Start Dev Server
```bash
npm run dev
```

### Type Check
```bash
npm run type-check
```

### Build Production
```bash
npm run build
```

### Preview Build
```bash
npm run preview
```

### Add Package
```bash
npm install --legacy-peer-deps <package-name>
```

---

## Environment Variables

```env
# Backend API
VITE_API_URL=http://localhost:8080/api/v1

# Azure CIAM Authentication
VITE_AZURE_CLIENT_ID=your-client-id
VITE_AZURE_AUTHORITY=https://login.microsoftonline.com/common
VITE_AZURE_REDIRECT_URI=http://localhost:5173
```

---

## API Integration

### Products
```typescript
catalogApi.fetchProducts({
  page: 1,
  limit: 12,
  topNotes: ['Citrus'],
  brand: ['Chanel'],
  minPrice: 50,
  maxPrice: 300,
  sortBy: 'price'
})

catalogApi.fetchProductById(id)
catalogApi.searchProducts(query)
```

### Orders
```typescript
orderApi.createOrder({
  items: [{ productId: '123', quantity: 2 }],
  deliveryAddress: '123 Main St',
  phone: '+1-555-0123'
})

orderApi.fetchOrderById(orderId)
orderApi.fetchUserOrders()
```

### Authentication
All requests automatically include JWT token via Axios interceptor

---

## Styling Guide

### Colors (from tailwind.config.js)
- **Primary:** `primary-600` (#b89660) - warm brown
- **Secondary:** `secondary` (#d4af37) - gold
- **Background:** `gray-900 dark:gray-950` - charcoal
- **Text:** `gray-900 dark:gray-50` - black/cream

### Typography
- **Headers:** `font-serif text-3xl font-bold` - Playfair Display
- **Body:** `font-sans text-base` - Inter
- **Accent:** `text-luxury-gold` - gold

### Spacing
```typescript
// Use Tailwind utilities
<div className="p-4 m-2 gap-6 space-y-4">
```

### Dark Mode
```typescript
// Automatic with class strategy
<div className="bg-white dark:bg-gray-900">
```

---

## TypeScript Tips

### Component Props
```typescript
interface ButtonProps {
  onClick: () => void;
  disabled?: boolean;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({ onClick, children }) => (
  <button onClick={onClick}>{children}</button>
)
```

### Redux Types
```typescript
const dispatch = useAppDispatch();
const cart = useAppSelector(state => state.cart);
```

### API Responses
```typescript
try {
  const products = await catalogApi.fetchProducts(params);
  // products: FetchProductsResponse
} catch (error) {
  // error: unknown (cast to Error or use Sentry)
}
```

---

## Performance Checklist

- ✅ Code splitting at routes
- ✅ Lazy component loading available
- ✅ Redux selectors prevent re-renders
- ✅ Framer Motion GPU-accelerated
- ✅ Tailwind CSS purged in production
- ✅ Bundle minified with Terser
- ⚠️ Consider: Image optimization
- ⚠️ Consider: Service worker
- ⚠️ Consider: Analytics

---

## Testing Checklist

### Manual Testing
- [ ] Homepage loads
- [ ] Navigation works
- [ ] Login redirects to Azure
- [ ] Products load in catalog
- [ ] Filters work
- [ ] Search works
- [ ] Add to cart works
- [ ] Checkout form displays
- [ ] Dark/light mode toggles
- [ ] Mobile responsive

### Browser Compatibility
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)
- [ ] Mobile Safari (iOS)
- [ ] Chrome Mobile (Android)

---

## Troubleshooting

### "npm ERR! peer dependencies"
```bash
npm install --legacy-peer-deps
```

### "VITE_AZURE_CLIENT_ID is undefined"
- Verify `.env` file exists
- Check environment variable name (VITE_ prefix required)

### "Cannot acquire token"
- Verify Azure credentials in `.env`
- Check redirect URI matches Azure portal
- Ensure backend API has CORS enabled

### "Styles not loading"
```bash
npm run build  # Verify Tailwind compilation
```

### "API returns 401"
- Verify user is logged in
- Check localStorage for tokens
- Verify backend validates tokens

---

## Deployment

### Quick Deploy to Vercel
```bash
npm install -g vercel
vercel
# Follow prompts, add env vars
```

### Build & Deploy to AWS S3
```bash
npm run build
aws s3 sync dist/ s3://perfume-shop-frontend --delete
aws cloudfront create-invalidation --distribution-id E123 --paths "/*"
```

### Docker
```bash
docker build -t perfume-shop-frontend .
docker run -p 3000:3000 perfume-shop-frontend
```

---

## Resources

- [Full Setup Guide](./FRONTEND_SETUP.md)
- [Deployment Guide](./DEPLOYMENT_GUIDE.md)
- [Initialization Summary](../FRONTEND_INITIALIZATION.md)
- [Project README](./README.md)

---

## Support

**Questions?** Check these in order:
1. Search the documentation
2. Check component comments
3. Review TypeScript errors: `npm run type-check`
4. Enable Sentry for error tracking
5. Check backend API response

**Common Issues?**
- MSAL/Azure setup → Review `src/config/msalConfig.ts`
- Styling issues → Check `tailwind.config.js`
- API errors → Check `src/api/axiosInstance.ts` interceptors
- Redux issues → Check `src/store/index.ts`

---

**Created:** August 15, 2024
**Status:** ✅ Ready for Development
**Next Steps:** Configure Azure CIAM → Test API → Deploy to staging
