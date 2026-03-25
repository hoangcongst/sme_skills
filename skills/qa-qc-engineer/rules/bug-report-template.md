---
title: Bug Report Template
impact: MEDIUM
impactDescription: Clear bug reports get fixed 3x faster than vague ones
tags: bug-report, defect, quality, communication
---

## Bug Report Template

A good bug report answers: What happened? What should have happened? How do I reproduce it?

### Template

```markdown
## Bug Report: [Brief descriptive title]

**Severity**: 🔴 Critical / 🟠 High / 🟡 Medium / 🟢 Low
**Priority**: P0 (fix now) / P1 (this sprint) / P2 (next sprint) / P3 (backlog)
**Environment**: Production / Staging / Local
**Platform**: iOS 17.2 / Android 14 / Chrome 120 / Safari 17

### Description
[1-2 sentence summary of the issue]

### Steps to Reproduce
1. Navigate to [page/screen]
2. Click on [element]
3. Enter [specific input]
4. Click [button]

### Expected Behavior
[What should happen]

### Actual Behavior
[What actually happens, including error messages]

### Evidence
- Screenshot: [attach]
- Video: [attach]
- Console errors: [paste relevant logs]
- Network tab: [relevant request/response]

### Impact
[Who is affected? How many users? Revenue impact?]

### Additional Context
- First noticed: [date]
- Frequency: Always / Intermittent (X out of Y attempts)
- Workaround: [if any]
- Related issues: [links]
```

### Severity Classification

| Severity | Definition | Examples | SLA |
|----------|-----------|---------|-----|
| 🔴 **Critical** | System down, data loss, security breach | App crashes, payment fails, data exposed | Fix within hours |
| 🟠 **High** | Major feature broken, no workaround | Can't login, search returns wrong results | Fix within 1-2 days |
| 🟡 **Medium** | Feature degraded, workaround exists | Slow loading, minor UI glitch on one device | Fix within sprint |
| 🟢 **Low** | Cosmetic, minor inconvenience | Typo, alignment off by 1px, tooltip missing | Backlog |

### Anti-Patterns in Bug Reports

| Bad | Good |
|-----|------|
| "It doesn't work" | "Clicking 'Submit' returns a 500 error" |
| "Sometimes it crashes" | "Crashes 3 out of 5 times when scrolling past 50 items on iPhone 15" |
| "The page looks wrong" | "Product image overlaps the title text on screens < 375px width" |
| No reproduction steps | Step-by-step with specific inputs |
