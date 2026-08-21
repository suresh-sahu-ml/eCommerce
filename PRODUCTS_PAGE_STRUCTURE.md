# Products Page Component Structure

## Overview
The Products page is split into modular React components for better maintainability and reusability.

## File Structure

```
src/
├── pages/
│   └── ProductsPage.jsx           # Main products page container
├── components/
│   └── Products/
│       ├── ProductIntro.jsx       # Brand intro section
│       ├── ProductFilters.jsx     # Sidebar filters (sort, house, family)
│       ├── ProductGrid.jsx        # Grid layout container
│       ├── ProductCard.jsx        # Individual product card
│       └── Pagination.jsx         # Page navigation
```

## Component Details

### ProductsPage.jsx
Main container managing:
- **State**: scroll state, filters, current page
- **Data**: PRODUCTS array with 6 sample products
- **Handlers**: scroll detection, house filter changes
- **Props Distribution**: Passes state and handlers to child components

### ProductIntro.jsx
- Displays logo, title "The Collection"
- Descriptive text about the collection
- Centered layout with consistent spacing

### ProductFilters.jsx
**Props**:
- `sortBy` - Current sort option (featured, newest, price-high)
- `setSortBy` - Update sort state
- `selectedHouses` - Array of selected house filters
- `handleHouseChange` - Toggle house selection
- `selectedFamily` - Current family filter
- `setSelectedFamily` - Update family filter

**Features**:
- Radio buttons for sort options (custom styled)
- Checkboxes for house selection (with check icons)
- Button group for olfactive families
- DCarlem pre-selected by default

### ProductGrid.jsx
- Maps products array to ProductCard components
- Responsive 3-column layout (lg), 2-column (md), 1-column (sm)
- Passes product data and index to each card

### ProductCard.jsx
**Props**:
- `product` - Product object with name, house, family, price, image
- `index` - Card index for staggered layout

**Features**:
- Aspect ratio 4:5 for images
- Hover effect: image zoom + button reveal
- Staggered vertical offsets for visual interest
- Product info: house, name, family, price
- Add to Bag button (interactive on hover)

### Pagination.jsx
**Props**:
- `currentPage` - Currently active page (1-3)
- `setCurrentPage` - Update page state

**Features**:
- Previous/Next navigation buttons
- Page number buttons (1, 2, 3)
- Disabled state when at boundaries
- Active page highlighted with border

## State Management

```javascript
// ProductsPage.jsx state
const [scrolled, setScrolled] = useState(false);        // Header style
const [sortBy, setSortBy] = useState('featured');      // Sort option
const [selectedHouses, setSelectedHouses] = useState(['DCarlem']); // Filter
const [selectedFamily, setSelectedFamily] = useState('Floral');    // Filter
const [currentPage, setCurrentPage] = useState(1);     // Pagination
```

## Product Data Structure

```javascript
{
  id: 1,
  name: 'Aurelia Nocturn',
  house: 'DCarlem',
  family: 'Oriental & Spicy',
  price: 285,
  image: 'https://...'
}
```

## Key Features

✅ **Responsive Layout**: Mobile-first with tailored breakpoints
✅ **Custom Radio/Checkbox**: Styled with Tailwind, no native input visible
✅ **Hover Effects**: Image zoom, button reveal, color transitions
✅ **Staggered Cards**: Alternate vertical offsets for grid layout
✅ **Pagination**: Simple page navigation (3 pages)
✅ **Filter State**: Persistent across page interaction
✅ **Material Icons**: Check mark, navigation arrows

## Usage

```jsx
import ProductsPage from './pages/ProductsPage';

// In your router
<Route path="/products" element={<ProductsPage />} />
```

## Styling Notes

- All components use Tailwind CSS classes
- Custom filter styling with hidden inputs + styled spans/buttons
- Responsive spacing with margin-mobile and margin-desktop variables
- Staggered grid using margin utility classes (mt-12, -mt-12)
- Smooth transitions on all interactive elements

## Future Enhancements

- Connect filters to actually filter products
- Implement product filtering logic
- Add product detail modal/page
- Connect "Add to Bag" to cart state management
- API integration for product data
- Loading states and skeleton screens
