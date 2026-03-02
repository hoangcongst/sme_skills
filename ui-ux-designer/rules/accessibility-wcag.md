---
title: WCAG 2.1 AA Compliance Checklist
impact: HIGH
impactDescription: Non-compliance excludes 15% of users and creates legal liability
tags: accessibility, wcag, a11y, compliance, inclusive-design
---

## WCAG 2.1 AA Compliance Checklist

WCAG AA is the minimum standard for all digital products. This checklist covers the most impactful criteria.

### Perceivable

- [ ] **1.1.1 Non-text Content**: All images have alt text; decorative images use `alt=""`
- [ ] **1.3.1 Info and Relationships**: Use semantic HTML (`<nav>`, `<main>`, `<header>`, `<h1>`-`<h6>`)
- [ ] **1.3.2 Meaningful Sequence**: Reading order is logical when CSS is disabled
- [ ] **1.4.1 Use of Color**: Color is not the only means of conveying information
- [ ] **1.4.3 Contrast**: Text contrast ≥ 4.5:1 (normal), ≥ 3:1 (large text / UI elements)
- [ ] **1.4.4 Resize Text**: Content usable when text is resized to 200%
- [ ] **1.4.10 Reflow**: Content reflows at 320px width without horizontal scroll
- [ ] **1.4.11 Non-text Contrast**: UI component boundaries have ≥ 3:1 contrast ratio
- [ ] **1.4.12 Text Spacing**: Content works with increased letter/line/word spacing

### Operable

- [ ] **2.1.1 Keyboard**: All functionality available via keyboard
- [ ] **2.1.2 No Keyboard Trap**: Users can navigate away from any component
- [ ] **2.4.1 Bypass Blocks**: Skip navigation link for keyboard users
- [ ] **2.4.2 Page Titled**: Descriptive, unique page titles
- [ ] **2.4.3 Focus Order**: Tab order matches visual reading order
- [ ] **2.4.6 Headings and Labels**: Descriptive headings and form labels
- [ ] **2.4.7 Focus Visible**: Keyboard focus indicator is clearly visible
- [ ] **2.5.5 Target Size**: Touch targets are at least 44×44 CSS pixels

### Understandable

- [ ] **3.1.1 Language**: Page language is declared (`<html lang="en">`)
- [ ] **3.2.1 On Focus**: Focus doesn't trigger unexpected context changes
- [ ] **3.2.2 On Input**: Input doesn't trigger unexpected context changes
- [ ] **3.3.1 Error Identification**: Errors clearly identified with text (not just color)
- [ ] **3.3.2 Labels**: Form inputs have associated visible labels
- [ ] **3.3.3 Error Suggestion**: Error messages suggest how to fix the issue
- [ ] **3.3.4 Error Prevention**: Confirm destructive actions, allow undo

### Robust

- [ ] **4.1.1 Parsing**: Valid HTML without duplicate IDs
- [ ] **4.1.2 Name, Role, Value**: Custom components have correct ARIA roles and states
- [ ] **4.1.3 Status Messages**: Dynamic content updates announced to screen readers

### Testing Tools

| Tool | What It Tests | Platform |
|------|--------------|----------|
| axe DevTools | Full WCAG audit | Chrome extension |
| Lighthouse | Automated a11y score | Chrome DevTools |
| Contrast Checker | Color contrast ratios | WebAIM online tool |
| Screen readers | Real user experience | VoiceOver (Mac/iOS), TalkBack (Android), NVDA (Windows) |
| Keyboard | Navigation and focus | Tab through entire page |
