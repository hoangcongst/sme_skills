---
title: Mobile-First Responsive Design Patterns
impact: HIGH
impactDescription: 60%+ of web traffic is mobile — mobile-first prevents painful retrofits
tags: responsive, mobile-first, breakpoints, layout, grid
---

## Mobile-First Responsive Design Patterns

Design for the smallest screen first, then enhance for larger screens.

### Breakpoint System

```css
/* ✅ Mobile-first breakpoints */
/* Base styles = mobile (no media query needed) */

@media (min-width: 640px)  { /* sm: Small tablets, landscape phones */ }
@media (min-width: 768px)  { /* md: Tablets */ }
@media (min-width: 1024px) { /* lg: Small desktops, landscape tablets */ }
@media (min-width: 1280px) { /* xl: Desktops */ }
@media (min-width: 1536px) { /* 2xl: Large desktops */ }

/* ❌ Desktop-first (harder to maintain) */
@media (max-width: 768px) { /* Override desktop styles for mobile */ }
```

### Common Layout Patterns

```
1. Stack → Grid
   Mobile: Single column stack
   Tablet: 2-column grid
   Desktop: 3-4 column grid

2. Sidebar → Bottom navigation
   Mobile: Bottom tab bar
   Desktop: Side navigation panel

3. Cards → Table
   Mobile: Stacked cards
   Desktop: Data table with columns

4. Modal → Full-screen
   Mobile: Full-screen overlay
   Desktop: Centered modal dialog

5. Hamburger → Visible nav
   Mobile: Hamburger → slide-out menu
   Desktop: Full navigation bar visible
```

### Responsive Typography

```css
/* ✅ Fluid typography using clamp */
h1 {
  /* Min 24px, preferred 5vw, max 48px */
  font-size: clamp(1.5rem, 5vw, 3rem);
}

body {
  /* Min 14px, preferred 1.6vw, max 18px */
  font-size: clamp(0.875rem, 1.6vw, 1.125rem);
}
```

### Touch Target Sizes

| Platform | Minimum Size | Recommended Size |
|----------|-------------|-----------------|
| iOS | 44×44 pt | 48×48 pt |
| Android | 48×48 dp | 48×48 dp |
| Web (touch) | 44×44 px | 48×48 px |
| Web (mouse) | 24×24 px | 32×32 px |

### Testing Checklist

- [ ] Content readable without horizontal scroll at 320px width
- [ ] Touch targets meet minimum size on mobile
- [ ] Images scale appropriately (srcset / responsive images)
- [ ] Text wraps correctly, no overflow
- [ ] Navigation adapts to screen size
- [ ] Modals/overlays work on small screens
- [ ] Test on real devices (not just browser resize)
