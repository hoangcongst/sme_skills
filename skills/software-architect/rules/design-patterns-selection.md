---
title: Choose Design Patterns by Problem Context
impact: CRITICAL
impactDescription: Prevents over-engineering and ensures maintainability
tags: design-patterns, architecture, decision-making
---

## Choose Design Patterns by Problem Context

Design patterns solve specific problems. Applying patterns without understanding the problem context leads to unnecessary complexity and rigid code.

**Incorrect (pattern-first thinking):**

```
"We should use the Strategy pattern here because it's a best practice."
"Let's add an Abstract Factory for all our object creation."
"Every service needs a Repository pattern with Unit of Work."
```

Result: Layers of abstraction with no clear benefit, harder to understand and debug.

**Correct (problem-first thinking):**

```
Problem: "We need to swap between payment providers at runtime."
→ Strategy Pattern — Runtime algorithm selection is the exact problem it solves.

Problem: "We have simple CRUD with one database."
→ Direct data access — No repository abstraction needed yet. Add it when you have
  a second data source or need testability isolation.

Problem: "Multiple subsystems need to react when an order is placed."
→ Observer/Event Pattern — Decouples producers from consumers.
```

### Decision Framework

| Ask This | If Yes → | If No → |
|----------|----------|---------|
| Do I need to swap behavior at runtime? | Strategy / State | Direct implementation |
| Do multiple things need to know when X happens? | Observer / Events | Direct call |
| Do I need to create families of related objects? | Abstract Factory | Simple constructor |
| Is object creation complex with many variations? | Builder | Constructor with params |
| Do I need to add behavior without modifying existing code? | Decorator | Modify the class |

### Principle
> "The best pattern is the one you don't need. Start with the simplest solution. Refactor to a pattern when the problem actually emerges." — YAGNI
