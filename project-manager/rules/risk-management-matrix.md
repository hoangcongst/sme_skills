---
title: Risk Management Matrix
impact: MEDIUM
impactDescription: Proactive risk management prevents 70% of project crises
tags: risk, management, mitigation, planning
---

## Risk Management Matrix

Identify risks early, assess them systematically, and plan mitigations before they become crises.

### Risk Assessment Framework

```
Risk Score = Probability × Impact

Probability: 1 (Unlikely) → 5 (Almost Certain)
Impact:      1 (Negligible) → 5 (Critical)
```

| Score | Level | Action |
|-------|-------|--------|
| 1-4 | LOW | Monitor, accept the risk |
| 5-9 | MEDIUM | Mitigate, assign owner, review weekly |
| 10-15 | HIGH | Active mitigation plan, escalate to stakeholders |
| 16-25 | CRITICAL | Immediate action required, may need scope change |

### Risk Register Template

| ID | Risk Description | Probability | Impact | Score | Mitigation | Owner | Status |
|----|-----------------|-------------|--------|-------|------------|-------|--------|
| R1 | Key developer leaves | 2 | 4 | 8 | Cross-train, document | PM | Active |
| R2 | Third-party API deprecation | 3 | 5 | 15 | Abstract API layer, monitor changelog | Architect | Active |
| R3 | Scope creep from stakeholder | 4 | 3 | 12 | Change request process, sprint goals | PM | Active |

### Common Software Project Risks

| Category | Typical Risks |
|----------|--------------|
| **People** | Key person dependency, skill gaps, team turnover |
| **Technical** | Integration complexity, performance unknowns, legacy tech debt |
| **External** | Vendor delays, API changes, regulatory requirements |
| **Scope** | Requirements churn, feature creep, unclear acceptance criteria |
| **Timeline** | Unrealistic deadlines, dependency delays, environment issues |

### Mitigation Strategies

| Strategy | When to Use |
|----------|------------|
| **Avoid** | Change plan to eliminate risk entirely |
| **Mitigate** | Reduce probability or impact with proactive action |
| **Transfer** | Shift risk to third party (insurance, outsource) |
| **Accept** | Low-impact risks with monitoring plan |
