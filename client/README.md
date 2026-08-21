# The Perfume Shop - Frontend Client

Modern, high-performance Single Page Application built with React 18+, TypeScript, and Vite for a luxury e-commerce platform.

## Technology Stack

- **Frontend Framework:** React 18.2.0
- **Build Tool:** Vite 5.0.10
- **Language:** TypeScript 5.3.3
- **UI Components:** NextUI (@nextui-org/react)
- **Styling:** Tailwind CSS 3.3.6
- **State Management:** Redux Toolkit 1.9.7
- **Authentication:** Azure MSAL (@azure/msal-react)
- **HTTP Client:** Axios 1.6.5
- **Animations:** Framer Motion 10.16.16
- **Routing:** React Router 6.20.1

## Project Structure

```
client/
├── public/              # Static assets
├── src/
│   ├── api/            # API integration (Axios, RTK Query, MSAL)
│   ├── components/     # Reusable UI components
│   ├── config/         # Configuration files (MSAL, etc.)
│   ├── hooks/          # Custom React hooks
│   ├── pages/          # Page components
│   ├── store/          # Redux slices and store configuration
│   ├── styles/         # Global CSS and Tailwind
│   ├── types/          # TypeScript type definitions
│   ├── utils/          # Utility functions
│   ├── App.tsx         # Main App component with routing
│   └── main.tsx        # Application entry point
├── index.html          # HTML template
├── vite.config.ts      # Vite configuration
├── tsconfig.json       # TypeScript configuration
├── tailwind.config.js  # Tailwind CSS configuration
├── postcss.config.js   # PostCSS configuration
└── package.json        # Dependencies
```

## Setup & Installation

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation Steps

1. **Install dependencies:**
```bash
cd client
npm install --legacy-peer-deps
```

2. **Configure environment variables:**
```bash
cp .env.example .env
```

Edit `.env` and add your Azure CIAM credentials:
```env
VITE_API_URL=http://localhost:8080/api/v1
VITE_AZURE_CLIENT_ID=your-azure-client-id
VITE_AZURE_AUTHORITY=https://login.microsoftonline.com/common
VITE_AZURE_REDIRECT_URI=http://localhost:5173
```

## Development

### Start Development Server
```bash
npm run dev
```
The application will be available at `http://localhost:5173`

### Type Checking
```bash
npm run type-check
```

### Build for Production
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

## Key Features

### 1. Authentication (Azure CIAM Integration)
- Authorization Code Flow with PKCE
- Automatic token acquisition and refresh
- Axios interceptor for Bearer token injection
- Protected routes for authenticated pages

### 2. State Management
- **Redux for UI State:** Cart drawer toggle, filters
- **API Layer:** Catalog and Order APIs with Axios
- **Local Storage:** Cart persistence

### 3. Core Pages
- **Home Page:** Hero landing with luxury branding
- **Catalog:** Responsive grid with advanced filtering
- **Product Details:** Full product information with image gallery
- **Checkout:** Multi-step order form
- **Order Confirmation:** Success page with order tracking

### 4. Styling & Theming
- Luxury theme with dark/light mode support
- Gold/cream accents on minimalist charcoal/slate backgrounds
- Serif headers (Playfair Display) and sans-serif body (Inter)
- Fully responsive design (mobile-first)

### 5. Components
- **Navbar:** Navigation with cart badge and user menu
- **ProductCard:** Animated cards with Framer Motion
- **FilterSidebar:** Complex filtering by notes, brand, price, search
- **ProtectedRoute:** Authentication guard for sensitive pages

## API Integration

### Catalog API
```typescript
catalogApi.fetchProducts(params)
catalogApi.fetchProductById(id)
catalogApi.fetchProductsByBrand(brand)
catalogApi.searchProducts(query)
```

### Order API
```typescript
orderApi.createOrder(orderData)
orderApi.fetchOrderById(orderId)
orderApi.fetchUserOrders()
orderApi.cancelOrder(orderId)
```

### Authentication
All requests are automatically intercepted to include the JWT bearer token:
```typescript
// Automatic token acquisition and attachment via Axios interceptor
Authorization: Bearer {JWT_TOKEN}
```

## Build Configuration

### Vite Configuration
- Development server on port 5173
- API proxy to `http://localhost:8080`
- Optimized production build with Terser minification
- Source maps disabled in production

### TypeScript Configuration
- Strict mode enabled
- ES2020 target
- Full source map support
- Type checking for DOM APIs

### Tailwind CSS Configuration
- NextUI plugin integration
- Custom luxury color palette
- Dark mode support with CSS class strategy
- Custom typography and components

## Performance Optimizations

- Code splitting via Vite
- Lazy loading of route components
- Image optimization recommendations
- Redux selectors for minimal re-renders
- Framer Motion for smooth 60fps animations

## Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API base URL | `http://localhost:8080/api/v1` |
| `VITE_AZURE_CLIENT_ID` | Azure CIAM application ID | Your Azure App ID |
| `VITE_AZURE_AUTHORITY` | Azure authority endpoint | `https://login.microsoftonline.com/common` |
| `VITE_AZURE_REDIRECT_URI` | OAuth2 redirect URI | `http://localhost:5173` |

## Troubleshooting

### MSAL Token Issues
If you encounter token acquisition errors:
1. Verify Azure credentials in `.env`
2. Check that the API has the correct scope configuration
3. Ensure redirect URI matches exactly in Azure portal

### CSS Not Loading
- Run `npm run build` to verify Tailwind CSS is compiled
- Check browser console for CSS loading errors
- Verify `tailwind.config.js` includes all template paths

### API Connection Issues
- Ensure backend is running on `http://localhost:8080`
- Check Vite proxy configuration in `vite.config.ts`
- Verify CORS is enabled on backend

## Contributing

When modifying the codebase:
1. Maintain TypeScript strict mode compliance
2. Follow the established component structure
3. Use Redux for synchronous state, API layer for async
4. Keep Tailwind utilities over custom CSS
5. Test responsive design at mobile, tablet, and desktop breakpoints

## License

Proprietary - The Perfume Shop
