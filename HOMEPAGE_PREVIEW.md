# Home Page Preview Guide 🎨

## What You'll See When Running `npm run dev`

### ✨ Hero Section (Full Screen Video Background)

```
╔════════════════════════════════════════════════════════════════════╗
║                                                                    ║
║                  [MUTED VIDEO - Perfume Product]                  ║
║                                                                    ║
║                     The Perfume Shop                              ║
║                   Discover Luxury in Every Spray                  ║
║                                                                    ║
║    Explore our curated collection of the world's finest            ║
║    fragrances, crafted by prestigious brands and perfumers.        ║
║                                                                    ║
║           [Shop Collection]    [Learn More]                        ║
║                                                                    ║
║                        ↓ Scroll ↓                                  ║
║                     (animating up/down)                            ║
║                                                                    ║
╚════════════════════════════════════════════════════════════════════╝
```

**Video Details:**
- Full-screen perfume product video
- Muted (no sound) ✓
- Looping continuously
- Dark overlay for text contrast
- Responsive to all screen sizes

---

### 🌟 Featured Fragrances Section

As you scroll down, you see:

```
╔════════════════════════════════════════════════════════════════════╗
║                                                                    ║
║                  Featured Fragrances                               ║
║           Handpicked selections from our luxury collection         ║
║                                                                    ║
║  ┌──────────────────────────────────────────────────────────────┐ ║
║  │                                                              │ ║
║  │  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────┐ │ ║
║  │  │                 │  │                 │  │             │ │ ║
║  │  │  [Image with    │  │  [Image with    │  │ [Image with │ │ ║
║  │  │   hover text    │  │   hover text    │  │  hover text │ │ ║
║  │  │   on hover]     │  │   on hover]     │  │  on hover]  │ │ ║
║  │  │                 │  │                 │  │             │ │ ║
║  │  ├─────────────────┤  ├─────────────────┤  ├─────────────┤ ║
║  │  │ CHANEL          │  │ DIOR            │  │ GUERLAIN    │ ║
║  │  │ Midnight        │  │ Golden Dreams   │  │ Ocean       │ ║
║  │  │ Elegance        │  │                 │  │ Whisper     │ ║
║  │  │ $155            │  │ $180            │  │ $165        │ ║
║  │  │ [View]          │  │ [View]          │  │ [View]      │ ║
║  │  └─────────────────┘  └─────────────────┘  └─────────────┘ ║
║  │                                                              │ ║
║  └──────────────────────────────────────────────────────────────┘ ║
║                                                                    ║
║                  [View All Perfumes →]                             ║
║                                                                    ║
╚════════════════════════════════════════════════════════════════════╝
```

**Product Cards Features:**
- High-quality perfume bottle images
- Brand name displayed
- Product name
- Price in USD
- Hover effects:
  - Card lifts up smoothly
  - Image zooms in (1.1x)
  - Description appears as overlay
  - View button becomes more prominent
- Click "View" to see product details
- 3 columns on desktop, 2 on tablet, 1 on mobile

---

### 🏆 Features Section

```
╔════════════════════════════════════════════════════════════════════╗
║                                                                    ║
║        ✨ Curated Collection    🏆 Premium Quality    🎁 Luxury   ║
║                                                                    ║
║    Handpicked fragrances    Authentic products    Premium          ║
║    from the world's most    with guaranteed        packaging and   ║
║    prestigious brands       authenticity and       personalized    ║
║                             satisfaction           service         ║
║                                                                    ║
╚════════════════════════════════════════════════════════════════════╝
```

**Design:**
- Light gradient background
- 3 icon-based features
- Centered text
- Clean spacing

---

### 🎯 Call-to-Action Section

```
╔════════════════════════════════════════════════════════════════════╗
║                                                                    ║
║              Ready to Find Your Signature Scent?                   ║
║                                                                    ║
║   Explore our complete collection and discover fragrances that     ║
║      match your personality and style.                             ║
║                                                                    ║
║           [Shop Now]         [About Us]                            ║
║                                                                    ║
╚════════════════════════════════════════════════════════════════════╝
```

---

## 🎬 Interactive Elements

### Hover Effects

**On Product Cards:**
```
BEFORE HOVER:
┌──────────────┐
│  [Image]     │
│              │
│ Product Name │
│ $155         │
│ [View]       │
└──────────────┘

AFTER HOVER:
┌──────────────┐
│ [Image Zooms]│ ← Zooms in 1.1x
│ "A sophistic…"│ ← Description appears
│              │
│ Product Name │
│ $155         │
│ [View]       │ ← More prominent
└──────────────┘↑ Card lifts up 10px
```

### Scroll Indicators

```
Hero Section → Bouncing arrow animates up/down
              (encourages scrolling)

Featured Products → Fade in as you scroll
                    (Intersection Observer animation)

Features → Slide in smoothly
           (Page-in animation)
```

---

## 📱 Responsive Design

### On Mobile (Phone)

```
┌─────────────────────┐
│   HERO SECTION      │
│  [Full Video]       │
│                     │
│ The Perfume Shop    │
│ (adjusted font)     │
│                     │
│  [Shop] [Learn]     │ ← Stacked
│                     │
└─────────────────────┘

┌─────────────────────┐
│ Featured Products   │
│                     │
│ ┌─────────────────┐ │
│ │  [Product 1]    │ │
│ │  Chanel $155    │ │
│ └─────────────────┘ │
│                     │
│ ┌─────────────────┐ │
│ │  [Product 2]    │ │
│ │  Dior $180      │ │
│ └─────────────────┘ │
│                     │
│ ┌─────────────────┐ │
│ │  [Product 3]    │ │
│ │  Guerlain $165  │ │
│ └─────────────────┘ │
│                     │
└─────────────────────┘
```

### On Tablet (iPad)

```
Products displayed in 2 columns
Slightly larger fonts
Full-width with padding
```

### On Desktop (1920px)

```
Products displayed in 3 columns
Large hero section
Full video background
Optimal spacing
```

---

## 🌓 Dark Mode

Same layout but with:
- Dark backgrounds (gray-900/950)
- Light text (white/cream)
- Adjusted contrast for readability
- Gold accents remain vibrant

**How to test:**
1. Open browser DevTools (F12)
2. Go to Rendering tab
3. Find "Emulate CSS media feature prefers-color-scheme"
4. Select "prefers-color-scheme: dark"
5. See home page transform!

---

## ✨ Animation Timeline

```
0ms   → Page loads
       → Hero section fades in (500ms)
       
300ms → Title animates in
400ms → Subtitle animates in
500ms → Buttons animate in
       → Scroll indicator starts bouncing

User scrolls ↓

1000ms → Featured section becomes visible
        → Products fade in with scale (300-500ms each)
        → Cards stagger animation

1500ms → Features section becomes visible
        → Features slide in (staggered)

2000ms → CTA section becomes visible
        → Text animates in

Throughout: Product cards respond to hover (0ms)
           Scroll indicator bounces continuously
```

---

## 🎥 Video Specifics

**Current Video Source:** Pexels (Free stock video)
- Professional perfume bottle
- Close-up shots
- Luxury aesthetic
- Perfect for hero background

**Video Properties:**
```
muted = true       ✓ No sound
loop = true        ✓ Repeats
autoPlay = true    ✓ Starts on load
playsInline = true ✓ Mobile-friendly
```

**Video Dimensions:**
- Scales to fill screen
- Maintains aspect ratio
- Responsive on all devices

---

## 🖼️ Featured Product Images

Using Unsplash CDN for realistic perfume photography:

1. **Midnight Elegance (Chanel)**
   - Elegant dark bottle
   - Professional lighting
   - Luxury aesthetic

2. **Golden Dreams (Dior)**
   - Amber-colored liquid
   - Sophisticated presentation
   - Premium feel

3. **Ocean Whisper (Guerlain)**
   - Crystal-clear bottle
   - Fresh, aquatic vibes
   - Light and airy

---

## 🚀 Performance

**Page Load:**
- Hero section renders immediately
- Video starts playing
- Products load as you scroll (lazy loading)
- Smooth 60fps animations

**Bundle Size Impact:**
- No new heavy dependencies
- Uses existing libraries
- Video hosted on CDN
- Images from CDN

---

## 🔗 Navigation from Home

From hero section:
- **"Shop Collection"** → `/catalog` (product grid)
- **"Learn More"** → `/about` (company info)

From featured products:
- **"View"** button → `/product/{id}` (product details)
- **"View All Perfumes"** → `/catalog` (full catalog)

From CTA section:
- **"Shop Now"** → `/catalog`
- **"About Us"** → `/about`

---

## 💡 Tips for Best Experience

1. **Full Screen:** Expand browser to fullscreen for best video effect
2. **Good Connection:** Video loads faster with better internet
3. **Modern Browser:** Use latest Chrome, Firefox, Safari, or Edge
4. **Scroll Slowly:** Take time to appreciate animations
5. **Try Dark Mode:** Toggle theme to see design in both modes
6. **Mobile Test:** Test on actual phone or use DevTools responsive mode

---

## 📸 Snapshot

What the page feels like:
- **Modern** ✓
- **Luxurious** ✓
- **Not black/dark** ✓
- **Interactive** ✓
- **Video background** ✓
- **Featured products** ✓
- **Smooth animations** ✓
- **Responsive** ✓
- **Professional** ✓

---

## 🎊 Ready to Try It?

```bash
cd client
npm run dev
# Navigate to http://localhost:5173
```

Enjoy the new modern home page! 🌟

---

**Last Updated:** August 15, 2024
**Status:** ✅ Live and ready to explore
