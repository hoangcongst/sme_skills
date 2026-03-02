---
title: User Research Methods Guide
impact: MEDIUM
impactDescription: Right research method saves weeks of building the wrong thing
tags: user-research, interviews, testing, personas, journey-mapping
---

## User Research Methods Guide

Match the research method to the question you're trying to answer.

### Method Selection Matrix

| Question | Method | Time | Participants |
|----------|--------|------|-------------|
| "Who are our users?" | **User Interviews** | 2-3 days | 5-8 users |
| "Can users complete this task?" | **Usability Testing** | 1-2 days | 5 users |
| "What do users think of this concept?" | **Concept Testing** | 1 day | 5-8 users |
| "How do users group this content?" | **Card Sorting** | 0.5 day | 10-15 users |
| "Which design performs better?" | **A/B Testing** | 1-2 weeks | 100+ users |
| "What are users doing in our product?" | **Analytics Review** | 0.5 day | N/A |
| "What do users say about competitors?" | **Competitive UX Audit** | 1-2 days | N/A |

### User Interview Script Template

```markdown
## Interview Guide: [Feature/Product Name]

### Warm-up (2 min)
- "Tell me about your role and what you do day-to-day."

### Current Behavior (10 min)
- "Walk me through how you currently [do the task we're designing for]."
- "What's the most frustrating part of that process?"
- "What tools do you use today? What do you like/dislike about them?"

### Problem Exploration (10 min)
- "When was the last time [problem] happened? Tell me about that."
- "How did you solve it?"
- "If you had a magic wand, what would you change?"

### Concept Reaction (10 min) - if showing designs
- "What's your first impression?"
- "What would you expect to happen if you [clicked/tapped this]?"
- "What's confusing or unclear?"
- "Would you use this? Why or why not?"

### Wrap-up (3 min)
- "Is there anything I didn't ask about that you think is important?"
- "Can I follow up if I have more questions?"
```

### Usability Testing Protocol

```
1. Define Tasks (3-5 core tasks)
   - "Sign up for a new account"
   - "Find and purchase [product]"
   - "Update your profile photo"

2. Run Sessions (5 users is enough for 85% of issues)
   - Think-aloud protocol: "Tell me what you're thinking as you go"
   - Don't help or lead: "What would you do if I weren't here?"
   - Note: Task success, time, errors, hesitations, verbal feedback

3. Analyze
   - Task success rate (target: > 80%)
   - Error rate per task
   - Time on task (compare to benchmark)
   - Group issues by severity

4. Report
   - Top 3 critical findings with video clips
   - Recommendations prioritized by impact × effort
```

### Persona Template

```markdown
## [Persona Name] — [Role/Label]

**Demographics**: Age, occupation, tech savviness
**Goals**: What they're trying to achieve (2-3 goals)
**Frustrations**: What blocks them today (2-3 pain points)
**Quote**: A representative statement that captures their mindset

**Scenario**: "When [trigger], [Name] needs to [action] so they can [goal].
Currently, they [workaround], which causes [pain point]."
```

### The "5 Users" Rule
> Testing with 5 users finds 85% of usability problems (Nielsen Norman Group).
> Test early with 5 users, fix the top issues, then test again with 5 more.
> This is more effective than one big study with 20+ users.

Reference: [NNG Research Methods](https://www.nngroup.com/articles/which-ux-research-methods/)
