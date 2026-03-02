---
title: Design System Token Architecture
impact: CRITICAL
impactDescription: Tokens ensure visual consistency across all components and platforms
tags: design-system, tokens, colors, typography, spacing
---

## Design System Token Architecture

Design tokens are the single source of truth for your visual language. They ensure consistency across components, platforms, and teams.

### Token Hierarchy

```
Global Tokens (primitive values)
├── color-blue-500: #3B82F6
├── font-size-16: 16px
└── spacing-4: 16px

Semantic Tokens (purpose-mapped)
├── color-primary: var(--color-blue-500)
├── color-error: var(--color-red-500)
├── text-body: var(--font-size-16)
└── spacing-component-gap: var(--spacing-4)

Component Tokens (component-specific)
├── button-bg: var(--color-primary)
├── button-text: var(--color-white)
├── button-padding: var(--spacing-3) var(--spacing-4)
└── button-radius: var(--radius-md)
```

### Color System

```css
/* ✅ Correct: Semantic color tokens */
:root {
  /* Primitives (never used directly in components) */
  --color-blue-50: #EFF6FF;
  --color-blue-500: #3B82F6;
  --color-blue-700: #1D4ED8;
  --color-gray-50: #F9FAFB;
  --color-gray-900: #111827;
  --color-red-500: #EF4444;
  --color-green-500: #22C55E;
  --color-yellow-500: #EAB308;

  /* Semantic (used in components) */
  --color-primary: var(--color-blue-500);
  --color-primary-hover: var(--color-blue-700);
  --color-bg-primary: var(--color-gray-50);
  --color-text-primary: var(--color-gray-900);
  --color-success: var(--color-green-500);
  --color-error: var(--color-red-500);
  --color-warning: var(--color-yellow-500);

  /* Dark mode: override semantics only */
  @media (prefers-color-scheme: dark) {
    --color-bg-primary: var(--color-gray-900);
    --color-text-primary: var(--color-gray-50);
  }
}

/* ❌ Incorrect: Hardcoded colors in components */
.button { background: #3B82F6; }  /* Can't theme, can't change */
```

### Typography Scale

```
Scale: 1.25 (Major Third) — balanced for body text
12px → 14px → 16px (base) → 20px → 25px → 31px → 39px

Usage:
├── 12px: Captions, labels, helper text
├── 14px: Secondary text, metadata
├── 16px: Body text (base)
├── 20px: H4 / Subtitle
├── 25px: H3 / Section header
├── 31px: H2 / Page header
└── 39px: H1 / Hero text
```

### Spacing Scale (8px base unit)

```
4px  (0.5) — Tight spacing (icon + label gap)
8px  (1)   — Element gap (between related items)
16px (2)   — Component gap (between form fields)
24px (3)   — Section gap (between card sections)
32px (4)   — Layout gap (between page sections)
48px (6)   — Major gap (between page blocks)
64px (8)   — Hero spacing

Rule: Use multiples of 4px. 90% of your spacing should use these 7 values.
```

### Token Naming Convention

```
--{category}-{property}-{element}-{variant}-{state}

Examples:
--color-bg-button-primary-hover
--font-size-heading-lg
--spacing-padding-card
--radius-button
--shadow-card-elevated
```
