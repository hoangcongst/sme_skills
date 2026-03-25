---
title: Micro-interaction and Feedback Patterns
impact: MEDIUM
impactDescription: Good feedback reduces user errors by 50% and improves perceived performance
tags: interaction, feedback, animation, loading, errors, empty-states
---

## Micro-interaction and Feedback Patterns

Every user action should produce visible feedback. The system should always communicate its state.

### The 4 States of Every Component

```
1. Empty State    → What to show when there's no data yet
2. Loading State  → What to show while fetching data
3. Success State  → The happy path with content
4. Error State    → What to show when something fails
```

### Loading Patterns

| Pattern | Use When | Example |
|---------|----------|---------|
| **Skeleton** | Content layout is predictable | List items, cards, profiles |
| **Spinner** | Quick action (< 3s expected) | Button submission, API call |
| **Progress bar** | Duration is known/estimable | File upload, multi-step process |
| **Shimmer** | Content is loading in sections | Feed items, image grids |
| **Optimistic update** | High confidence of success | Toggle switch, like button |

```
✅ Skeleton screen (preferred for content areas):
┌────────────────────────┐
│ ████████████████       │  ← Avatar + Name shimmer
│ █████████████████████  │  ← Subtitle shimmer
│                        │
│ █████████████████████  │
│ ██████████████████     │  ← Content shimmer
│ ████████████████████   │
└────────────────────────┘

❌ Full-page spinner (blocks everything, feels slow)
```

### Empty States

```
Good empty state formula:
1. Illustration or icon (friendly, not error-like)
2. Explanation (what could be here)
3. Call to action (how to fill it)

Example:
┌─────────────────────────────┐
│        📦                    │
│   No orders yet             │
│   When you make a purchase, │
│   it'll show up here.       │
│                             │
│   [Browse Products]         │
└─────────────────────────────┘
```

### Error Messages

```
✅ Good error messages:
- "We couldn't save your changes. Check your connection and try again."
- "This email is already registered. Sign in or use a different email."
- "Payment declined. Please try a different card or contact your bank."

❌ Bad error messages:
- "Error 500"
- "Something went wrong" (what? how to fix?)
- "Invalid input" (which field? what's wrong?)

Formula: [What happened] + [Why] + [How to fix it]
```

### Button Feedback States

```
Idle    → Default appearance
Hover   → Subtle highlight (cursor change + bg shift)
Active  → Pressed/depressed visual (scale 0.98, darker bg)
Loading → Disable + spinner + "Processing..." text
Success → Green flash + checkmark (1-2s) → return to idle
Error   → Red flash + shake animation → show error message
```

### Animation Timing

| Duration | Use For | Example |
|----------|---------|---------|
| 100-150ms | Hover effects, button press | Background color change |
| 200-300ms | Small transitions | Accordion open, tooltip appear |
| 300-500ms | Larger transitions | Modal open, page transitions |
| 500ms+ | Complex animations | Celebration effects, onboarding |

### Motion Principles

- **Purposeful**: Every animation should convey meaning (direction, hierarchy, feedback)
- **Fast**: Users notice delays > 100ms. Keep transitions snappy.
- **Respectful**: Honor `prefers-reduced-motion` — provide static alternatives
- **Consistent**: Same action = same animation everywhere
