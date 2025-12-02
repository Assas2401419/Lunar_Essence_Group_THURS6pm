# Lunar Essence - CSS Organization

## Overview
The CSS has been reorganized into separate files for better maintainability and easier identification of page-specific styles.

## File Structure

### Core/Shared Files
- **common.css** - Base styles, variables, typography, buttons, forms, utilities
- **navigation.css** - Navbar and navigation components
- **footer.css** - Footer and newsletter components

### Page-Specific Files
- **home.css** - Home page styles (hero, philosophy, mission, collections, featured products)
- **about.css** - About page styles (story, mission/vision, values, craftsmanship, timeline)
- **products.css** - Products listing page styles (filters, product grid, sorting)
- **product-detail.css** - Individual product detail page styles
- **cart.css** - Shopping cart page styles
- **checkout.css** - Checkout process page styles
- **auth.css** - Authentication (login/register) page styles
- **care-tips.css** - Candle care tips page styles

## How to Use

Each HTML page now links to:
1. `common.css` - Always required (base styles)
2. `navigation.css` - Always required (navbar)
3. `footer.css` - Always required (footer)
4. Page-specific CSS file - Only the styles needed for that page

### Example (home.html):
```html
<link rel="stylesheet" href="../CSS/common.css">
<link rel="stylesheet" href="../CSS/navigation.css">
<link rel="stylesheet" href="../CSS/footer.css">
<link rel="stylesheet" href="../CSS/home.css">
```

## Benefits

1. **Better Organization** - Easy to find styles for specific pages
2. **Faster Loading** - Pages only load the CSS they need
3. **Easier Maintenance** - Changes to one page won't affect others
4. **Better Collaboration** - Multiple developers can work on different pages
5. **Clearer Structure** - Immediately know which file to edit for each page

## CSS Variables

All CSS variables are defined in `common.css` and available across all files:
- Colors (primary, secondary, accent, etc.)
- Typography (fonts, sizes, weights)
- Spacing (margins, padding)
- Shadows, borders, transitions

## Notes

- The original `style.css` file is preserved for reference
- Some complex page styles (checkout, auth, care-tips) may need additional extraction from the original file
- All files use the same CSS variable system for consistency
- Responsive breakpoints are consistent across all files

## Maintenance Tips

1. **Adding new styles**: Add to the appropriate page-specific file
2. **Shared components**: Add to `common.css`
3. **Navigation changes**: Edit `navigation.css`
4. **Footer changes**: Edit `footer.css`
5. **Global variables**: Update in `common.css` `:root` section
