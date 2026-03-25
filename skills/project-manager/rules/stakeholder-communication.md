---
title: Stakeholder Communication Patterns
impact: HIGH
impactDescription: Poor communication is the #1 cause of stakeholder dissatisfaction
tags: stakeholder, communication, status, reporting
---

## Stakeholder Communication Patterns

Tailor communication style, frequency, and detail level to each stakeholder type.

**Incorrect:**

```
- Same weekly email to CEO and developers → wrong level of detail for both
- Only reporting when things go wrong → stakeholders feel blindsided
- "Everything is fine" without data → erodes trust
- Technical jargon to business stakeholders → confusion and misalignment
```

**Correct:**

### Communication Matrix

| Stakeholder | Frequency | Format | Content Level |
|------------|-----------|--------|---------------|
| C-Suite / Sponsor | Bi-weekly | Dashboard + bullets | Strategic: ROI, timeline, risks |
| Product Owner | Daily standup | Verbal + board | Tactical: blockers, progress, decisions |
| Client / External | Weekly | Formal email/deck | Summary: milestones, demos, next steps |
| Dev Team | Daily | Standup + Slack | Operational: tasks, blockers, help needed |

### Status Report Template (Weekly)

```markdown
## Project: [Name] — Week of [Date]

### 🟢🟡🔴 Overall Status: [GREEN/AMBER/RED]

### Sprint Progress
- Sprint Goal: [One-liner]
- Velocity: [X] / [Target] story points
- Burndown: [On track / Behind by X points]

### Key Accomplishments
1. [Completed item with impact]
2. [Completed item with impact]

### Blockers & Risks
| Issue | Impact | Owner | ETA |
|-------|--------|-------|-----|
| [Blocker] | [HIGH] | [Name] | [Date] |

### Next Week Focus
1. [Priority deliverable]
2. [Priority deliverable]

### Decisions Needed
- [Decision description] — Need answer by [Date]
```

### RAG Status Guidelines

| Status | Meaning | Action |
|--------|---------|--------|
| 🟢 GREEN | On track, no significant risks | Continue as planned |
| 🟡 AMBER | At risk, mitigation in progress | Escalate awareness, monitor closely |
| 🔴 RED | Off track, needs intervention | Escalate immediately, propose options |

### The "No Surprises" Rule
> Never let a stakeholder learn bad news from someone other than you. Escalate early with: "Here's the problem, here's the impact, here are our options."
