---
title: Microservices vs Monolith Decision Guide
impact: MEDIUM
impactDescription: Architecture style mismatch wastes 3-6 months of engineering effort
tags: architecture, microservices, monolith, modular, team-topology
---

## Microservices vs Monolith Decision Guide

Architecture style should match team size, domain complexity, and deployment needs — not trends.

**Incorrect (trend-driven architecture):**

```
Team of 3 devs → "Let's build 12 microservices with Kubernetes"
→ 80% of time spent on infrastructure, 20% on product.
   Distributed debugging. Network failures. Data consistency nightmares.

Team of 50 devs → "Let's keep everything in one monolith"
→ Merge conflicts daily. 45-min deploy cycles. One team's bug
   crashes everyone's features. Can't scale independently.
```

**Correct (context-driven architecture):**

### Decision Framework

| Factor | Monolith | Modular Monolith | Microservices |
|--------|----------|-------------------|---------------|
| Team size | 1-8 devs | 5-20 devs | 15+ devs |
| Domain complexity | Low-Medium | Medium-High | High (distinct bounded contexts) |
| Deployment frequency | Weekly-Monthly | Daily-Weekly | Multiple times/day |
| Scale requirements | Uniform | Mostly uniform | Varies by service |
| Operational maturity | Low | Medium | High (need DevOps culture) |

### The Golden Path

```
Phase 1: Start Monolith
├── Fast iteration, simple deployment
├── Learn your domain boundaries
└── Ship features, validate product-market fit

Phase 2: Modular Monolith (when ready)
├── Enforce module boundaries within the monolith
├── Each module has clear API, own data access
└── Prepare for extraction if/when needed

Phase 3: Extract Services (only when needed)
├── Extract ONLY when a module needs independent:
│   - Scaling (different resource profile)
│   - Deployment (different release cadence)
│   - Technology (different language/runtime)
└── Keep everything else in the monolith
```

### Red Flags You Chose Wrong

**Monolith is failing when:**
- Deploy queue is > 1 week
- Teams block each other daily
- You can't scale a hot component independently

**Microservices are failing when:**
- Most PRs touch 3+ services
- You spend more time debugging distributed issues than building features
- Your "microservices" share a database

> "If you can't build a well-structured monolith, what makes you think microservices will be better?" — Simon Brown
