---
title: Effective Sprint Planning Sessions
impact: HIGH
impactDescription: Well-run sprint planning improves delivery predictability by 30-40%
tags: sprint, planning, scrum, agile, backlog
---

## Effective Sprint Planning Sessions

Sprint planning should be collaborative, time-boxed, and result in a clear sprint goal with committed stories.

**Incorrect:**

```
- PM reads stories aloud while team stays silent → no ownership
- 3-hour planning for a 2-week sprint → diminishing returns after 90 min
- No sprint goal → just a random pile of stories
- Stories pulled in without estimation or acceptance criteria → chaos mid-sprint
```

**Correct:**

### Sprint Planning Structure (90 min max for 2-week sprint)

```
Phase 1: Sprint Goal (10 min)
├── PM proposes 1 clear, measurable sprint goal
├── Team discusses feasibility
└── Agreement on the goal

Phase 2: Story Selection (30 min)
├── Pull from top of prioritized backlog
├── Each story must have:
│   ├── Clear acceptance criteria
│   ├── Estimation (story points)
│   └── No unresolved blockers
├── Team pulls based on velocity (avg of last 3 sprints)
└── Leave 15-20% buffer for unplanned work

Phase 3: Task Breakdown (40 min)
├── Each story broken into tasks (2-8 hours each)
├── Developers self-assign or team-assign
├── Identify cross-dependencies between stories
└── Flag any stories that need spikes

Phase 4: Commitment (10 min)
├── Team reviews total commitment vs capacity
├── Explicit "Can we deliver this?" check
└── Document sprint commitment
```

### Capacity Formula

```
Sprint Capacity = Team Size × Available Days × Focus Factor

Focus Factor (typical):
- New team: 0.5-0.6
- Established team: 0.7-0.8
- Experienced team: 0.8-0.9

Example: 5 devs × 10 days × 0.7 = 35 ideal days capacity
```

### Definition of Ready (Story must meet before entering sprint)

- [ ] User story follows format: As a [role], I want [feature], so that [benefit]
- [ ] Acceptance criteria are testable and specific
- [ ] Story is estimated by the team
- [ ] Dependencies are identified and resolved (or planned)
- [ ] Design/UX is provided if applicable
- [ ] Story is small enough to complete in one sprint
