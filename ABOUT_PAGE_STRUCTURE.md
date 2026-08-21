# About Us Page Component Structure

## Overview
The About Us page is organized into modular, reusable React components that showcase the brand story, signature product, and luxury partnerships.

## File Structure

```
src/pages/
└── AboutPage.jsx                        # Main container

src/components/About/
├── HeroSection.jsx                      # Hero with background image
├── StorySection.jsx                     # Origins and brand story
├── DCarlemSection.jsx                   # Signature product showcase
├── CuratedExcellenceSection.jsx         # Luxury brands and overlapping images
└── CallToActionSection.jsx              # Consultation booking CTA
```

## Component Details

### AboutPage.jsx
Main container managing:
- **State**: scroll state for header styling
- **Layout**: Vertical stack of all sections
- **Props Distribution**: Passes scrolled state to Header

### HeroSection.jsx
- Full-height hero with background image
- Decorative line dividers flanking tagline
- Gradient overlays for text readability
- Mix-blend-exclusion on title for visual effect
- Responsive padding and spacing

**Features**:
- Background image with multiple overlays
- Linear dividers on both sides of tagline
- Center-aligned text block
- Smooth gradient transitions

### StorySection.jsx
**Props**:
- None (uses local hover state)

**Features**:
- Asymmetric grid layout (2-column on md+)
- Image with slow hover zoom (2s duration)
- Decorative blur element behind image
- Location/atelier information section
- Hover overlay effect on image

**Layout**:
```
[Image] [Spacing] [Text + Location]
```

### DCarlemSection.jsx
**State**:
- `hoveredCard` - Tracks which card is currently hovered

**Features**:
- 3-column responsive grid
- Middle card offset down (md:mt-16)
- Card hover effects:
  - Image zoom (1.5s duration)
  - Text reveals on hover
  - Smooth opacity transitions
- Gradient overlays on all cards
- Decorative background pattern

**Card Data**:
```javascript
{
  id: string,
  title: string,
  description: string,
  image: URL
}
```

### CuratedExcellenceSection.jsx
**State**:
- `hoveredBrand` - Tracks which brand is hovered

**Features**:
- Asymmetric 2-column layout
- Left: Text + brand list
- Right: Overlapping images composition

**Brand List Interactive Effects**:
- Number color changes on hover
- Title opacity decreases on hover
- Arrow icon animates from left (-translate-x-4) on hover
- All transitions use `transition-all duration-300`

**Image Composition**:
- Main image: Top-right position, 4/5 aspect ratio (z-10)
- Secondary image: Bottom-left, grayscale, offset left (z-20)
- Overlapping creates depth effect
- Shadow effects on both images

### CallToActionSection.jsx
- Centered vertical layout
- Large display typography
- Booking button with secondary hover state
- Maximum width constraint on description text

## State Management

```javascript
// AboutPage.jsx
const [scrolled, setScrolled] = useState(false);

// HeroSection.jsx
// No state (presentational)

// StorySection.jsx
const [isImageHovered, setIsImageHovered] = useState(false);

// DCarlemSection.jsx
const [hoveredCard, setHoveredCard] = useState(null);

// CuratedExcellenceSection.jsx
const [hoveredBrand, setHoveredBrand] = useState(null);

// CallToActionSection.jsx
// No state (presentational)
```

## Key Features

✅ **Responsive Design**: Mobile-first with tailored md: and lg: breakpoints
✅ **Complex Layouts**: Asymmetric grids, overlapping images, negative spacing
✅ **Hover Effects**: Smooth transitions, scale/opacity/translate effects
✅ **Visual Hierarchy**: Mix-blend modes, gradient overlays, decorative elements
✅ **Accessibility**: Semantic HTML, proper heading hierarchy
✅ **Performance**: Optimized images, smooth animations (GPU-accelerated)

## Advanced CSS Techniques

### Mix-Blend Modes
```jsx
mix-blend-multiply   // DCarlem cards, secondary image
mix-blend-overlay    // Hero background
mix-blend-darken     // DCarlem images
mix-blend-exclusion  // Hero title
```

### Gradient Overlays
```jsx
// Story section
before:content-[''] before:absolute  // Line decorations

// DCarlem cards
bg-gradient-to-t from-surface via-transparent

// Hero section
bg-gradient-to-b from-surface via-transparent
```

### Staggered Layout
```jsx
// DCarlem cards
index === 1 ? 'md:mt-16' : ''

// Overlapping images
// Main: top-0 right-0 w-3/4 z-10
// Secondary: bottom-12 left-0 w-1/2 -ml-8 z-20
```

## Animation Timings

| Element | Duration | Easing |
|---------|----------|--------|
| Image zoom (Story) | 2000ms | ease-in-out |
| Image zoom (DCarlem) | 1500ms | ease-out |
| Text reveal | 500ms | default |
| Text reveal delay | 100ms | - |
| Hover transitions | 300ms | default |
| Arrow icon | 300ms | default |

## Usage

```jsx
import AboutPage from './pages/AboutPage';

// In your router
<Route path="/about" element={<AboutPage />} />
```

## Data Structures

### DCarlem Card
```javascript
{
  id: 'essence' | 'ingredients' | 'vessel',
  title: string,
  description: string,
  image: string (URL)
}
```

### Luxury Brand
```javascript
{
  id: number,
  name: string,
  number: string ('01' | '02' | '03')
}
```

## Responsive Breakpoints

### Mobile (default)
- Single column layouts
- Full-width images
- Stacked text and images

### Tablet (md:)
- 2-column asymmetric grids
- Overlapping images
- Offset cards

### Desktop (lg:)
- Same as tablet with refined spacing

## Styling Notes

- All sections use `max-w-[1440px] mx-auto` for container max-width
- Padding uses `px-margin-desktop` (64px) on desktop, `px-margin-mobile` (20px) on mobile
- Gap between grid columns uses `gap-gutter` (24px)
- Section spacing uses `py-section-gap` (120px)
- All text uses semantic font classes (headline-lg, body-md, label-sm, etc.)

## Future Enhancements

- Scroll-triggered animations using Intersection Observer
- Modal for consultation booking
- Image gallery/lightbox for DCarlem products
- Brand page navigation from brand list
- Social sharing functionality
- Newsletter subscription integration
