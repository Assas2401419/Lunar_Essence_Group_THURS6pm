# Lunar Essence CSS Organization Guide

## 📋 Table of Contents

This guide helps you navigate the `style.css` file easily. All sections are clearly labeled with visual dividers.

---

## 🎨 Main Sections

### 1. **GLOBAL STYLES** (Lines ~1-200)
- **CSS Variables**: All design tokens (colors, fonts, spacing, shadows)
- **Reset & Base Styles**: Browser resets and basic element styling

### 2. **NAVIGATION** (Lines ~200-800)
- **Main Navbar**: Desktop navigation styling
- **Logo Section**: Logo and branding
- **Navigation Menu**: Menu items and links
- **Dropdown Menus**: Collection dropdowns
- **Mobile Menu**: Responsive mobile navigation
- **Cart Badge**: Shopping cart counter

### 3. **COMMON COMPONENTS** (Lines ~800-1100)
- **Utility Classes**: Helper classes (hidden, sr-only, etc.)
- **Button Styles**: All button variations (primary, secondary, outline)
- **Typography**: Headings, paragraphs, text styles
- **Main Content Layout**: Page structure
- **Page Headers**: Breadcrumbs and page titles
- **Form Styles**: Input fields, labels, validation

### 4. **HOMEPAGE** (Lines ~1100-1600)
- **Hero Section**: Main landing section with background
- **Brand Philosophy**: Company story section
- **Mission Section**: Mission and vision cards
- **Collections Overview**: Moon phase collection cards
- **Featured Products**: Product grid display
- **Trust Indicators**: Trust badges and features
- **Newsletter**: Email signup section

### 5. **PRODUCTS PAGE** (Lines ~2500-3500)
- **Products Layout**: Grid and list views
- **Filters Sidebar**: Product filtering options
- **Product Cards**: Individual product styling
- **Sort & View Controls**: Sorting dropdown and view toggle
- **Pagination**: Page navigation

### 6. **ABOUT PAGE** (Lines ~5000-5900)
- **About Hero**: Page header with background
- **Brand Story**: Company history section
- **Mission & Vision**: Side-by-side cards
- **Values Section**: 5 value cards grid
- **Craftsmanship**: Product quality section
- **Timeline**: Company journey timeline
- **Student Info**: Academic project details

### 7. **CARE TIPS PAGE** (Lines ~6000-6800)
- **Care Header**: Page header
- **Table of Contents**: Navigation grid
- **Quick Tips**: 4 essential tips overview
- **Care Sections**: Detailed instruction sections
- **Instruction Lists**: Step-by-step guides
- **Burn Time Chart**: Candle size recommendations
- **Warning Boxes**: Important safety notices
- **Safety Section**: Safety guidelines grid
- **Storage Tips**: Storage recommendations
- **Troubleshooting**: Problem/solution cards
- **Support Section**: Contact and help options

### 8. **CHECKOUT PAGE** (Lines ~4100-5000)
- **Checkout Layout**: Two-column layout
- **Progress Indicator**: Step tracker
- **Form Sections**: Multi-step form styling
- **Order Summary**: Sidebar summary
- **Confirmation Modal**: Success popup

### 9. **FOOTER** (Lines ~1600-1900)
- **Footer Layout**: Multi-column footer
- **Social Links**: Social media icons
- **Newsletter Signup**: Footer newsletter
- **Footer Bottom**: Copyright and credits

### 10. **UTILITIES & RESPONSIVE** (Throughout)
- **Media Queries**: Responsive breakpoints
  - Mobile: 0-600px
  - Tablet: 600-950px
  - Desktop: 950px+
- **Print Styles**: Printer-friendly layouts
- **Accessibility**: High contrast, reduced motion
- **Animations**: Keyframes and transitions

---

## 🔍 How to Find Specific Styles

### By Visual Markers

All major sections use this format:
```css
/* ============================================================================
   SECTION NAME
   ============================================================================ */
```

All subsections use this format:
```css
/* ----------------------------------------------------------------------------
   Subsection Name
   ---------------------------------------------------------------------------- */
```

### By Search

Use your editor's search function (Ctrl+F or Cmd+F) to find:

- **Colors**: Search for `--color-` or specific color names
- **Spacing**: Search for `--space-` or `padding`, `margin`
- **Typography**: Search for `--font-` or `font-size`
- **Specific Components**: Search for class names like `.navbar`, `.product-card`, etc.
- **Responsive**: Search for `@media` to find all breakpoints

---

## 📐 CSS Variables Reference

### Colors
```css
--color-primary: #4A6B6B;      /* Deep Teal/Sage */
--color-secondary: #E8DCC4;    /* Cream/Beige */
--color-accent: #C9A961;       /* Soft Gold */
--color-text: #2C3E50;         /* Deep Navy */
--color-light-sage: #A8C5C0;   /* Light Sage */
```

### Spacing Scale
```css
--space-xs: 0.25rem;   /* 4px */
--space-sm: 0.5rem;    /* 8px */
--space-md: 1rem;      /* 16px */
--space-lg: 1.5rem;    /* 24px */
--space-xl: 2rem;      /* 32px */
--space-2xl: 3rem;     /* 48px */
--space-3xl: 4rem;     /* 64px */
--space-4xl: 6rem;     /* 96px */
```

### Font Sizes
```css
--font-xs: 0.75rem;    /* 12px */
--font-sm: 0.875rem;   /* 14px */
--font-base: 1rem;     /* 16px */
--font-lg: 1.125rem;   /* 18px */
--font-xl: 1.25rem;    /* 20px */
--font-2xl: 1.5rem;    /* 24px */
--font-3xl: 2rem;      /* 32px */
--font-4xl: 2.5rem;    /* 40px */
--font-5xl: 3rem;      /* 48px */
```

---

## 🎯 Quick Reference

### Common Class Patterns

- **Layout**: `.container`, `.grid`, `.flex`
- **Cards**: `.card`, `.product-card`, `.value-card`, `.tip-card`
- **Buttons**: `.btn`, `.btn-primary`, `.btn-outline`
- **Sections**: `.section`, `.hero-section`, `.care-section`
- **Navigation**: `.navbar`, `.nav-menu`, `.nav-link`
- **Forms**: `.form-group`, `.form-row`, `.input`

### Responsive Breakpoints

```css
/* Mobile First Approach */
/* Default: 0-599px (mobile) */

@media (min-width: 600px) {
  /* Tablet styles */
}

@media (min-width: 950px) {
  /* Desktop styles */
}

@media (min-width: 1280px) {
  /* Large desktop styles */
}
```

---

## 💡 Tips for Editing

1. **Use Variables**: Always use CSS variables for colors, spacing, and fonts
2. **Follow Patterns**: Look at existing components for styling patterns
3. **Mobile First**: Start with mobile styles, then add desktop overrides
4. **Test Responsive**: Check all breakpoints when making changes
5. **Keep Organized**: Add new styles in the appropriate section
6. **Comment Well**: Add comments for complex or non-obvious styles

---

## 🔧 Maintenance

### Adding New Styles

1. Find the appropriate section (Homepage, Products, etc.)
2. Add a subsection comment if needed
3. Follow existing naming conventions
4. Use CSS variables for consistency
5. Add responsive styles in the media queries section

### Modifying Existing Styles

1. Search for the class name or component
2. Check if it uses CSS variables
3. Test changes across all pages
4. Verify responsive behavior
5. Check accessibility (contrast, focus states)

---

## 📱 Page-Specific Sections

### Homepage
- Hero with parallax background
- Brand philosophy with moon visual
- Mission section with GIF
- Collections grid (5 moon phases)
- Featured products (5 cards)

### Products
- Sidebar filters
- Product grid (responsive columns)
- Sort and view controls
- Product cards with hover effects

### About
- Hero with gradient overlay
- Story grid (text + image)
- Mission/Vision cards
- Values grid (5 cards)
- Timeline (3 milestones)
- Student information card

### Care Tips
- Table of contents (6 items)
- Quick tips (4 cards)
- Detailed sections with images
- Safety grid (6 items)
- Troubleshooting cards
- Support section

### Checkout
- Progress indicator (4 steps)
- Multi-step form
- Order summary sidebar
- Confirmation modal

---

## 🎨 Design System

### Shadows
```css
--shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
--shadow-md: 0 4px 6px rgba(0, 0, 0, 0.1);
--shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.1);
--shadow-xl: 0 20px 25px rgba(0, 0, 0, 0.15);
```

### Border Radius
```css
--radius-sm: 4px;
--radius-md: 6px;
--radius-lg: 8px;
--radius-xl: 12px;
```

### Transitions
```css
--transition-fast: 0.15s ease;
--transition-normal: 0.3s ease;
--transition-slow: 0.5s ease;
```

---

## 📚 Additional Resources

- **Fonts**: Playfair Display (headings), Montserrat (body)
- **Icons**: Emoji-based icons throughout
- **Images**: Located in `/assets/` directory
- **JavaScript**: Corresponding JS files in `/Codes/Java/`

---

**Last Updated**: November 2025  
**Project**: Lunar Essence E-Commerce Website  
**Student**: Assas Benjamin (2401419)  
**Module**: CIT2011 - Individual Assignment #2
