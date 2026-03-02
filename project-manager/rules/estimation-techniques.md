---
title: Right-Size Estimation Techniques
impact: CRITICAL
impactDescription: Poor estimates cause 60% of project delays
tags: estimation, planning, story-points, t-shirt-sizing
---

## Right-Size Estimation Techniques

Use the right estimation method for the right context. Over-precise estimates waste time; under-precise estimates mislead stakeholders.

**Incorrect:**

```
"This feature will take exactly 3 days."
→ False precision. No buffer for unknowns. Sets rigid expectations.

"Let's spend 2 hours estimating every task in the next 6-month roadmap."
→ Wasted effort. Tasks 3+ months out will change dramatically.

"Senior dev estimates for the whole team."
→ Misses knowledge gaps. Creates unrealistic expectations for juniors.
```

**Correct (layered estimation):**

### Estimation Methods by Context

| Context | Method | Precision | Time Investment |
|---------|--------|-----------|-----------------|
| Roadmap (3-12 months) | T-Shirt Sizing (S/M/L/XL) | ±50% | 5 min per epic |
| Release (1-3 months) | Story Points (Fibonacci) | ±30% | 15 min per story |
| Sprint (1-2 weeks) | Hours (range) | ±20% | 5 min per task |
| Task in progress | Remaining hours | ±10% | 1 min |

### T-Shirt Sizing Guide

| Size | Effort (days) | Typical Scope |
|------|--------------|---------------|
| S | 1-2 | Single component change, bug fix |
| M | 3-5 | Feature with known patterns |
| L | 1-2 weeks | Feature with some unknowns |
| XL | 2-4 weeks | Major feature, needs spike first |
| XXL | 1+ month | Epic — must be broken down further |

### Story Points: The 3-Question Method

For each story, ask:
1. **Complexity**: How many moving parts? (Low/Medium/High)
2. **Uncertainty**: How well do we understand this? (Clear/Some unknowns/Research needed)
3. **Effort**: How much raw work? (Small/Medium/Large)

Map to Fibonacci: 1, 2, 3, 5, 8, 13, 21

> **Rule**: Any story estimated at 13+ should be broken down further.

### Anti-Patterns to Avoid
- ❌ Estimating alone (always team-based)
- ❌ Treating estimates as commitments
- ❌ Not tracking actual vs estimated (no learning)
- ❌ Padding every estimate "just in case" (use explicit risk buffers instead)
