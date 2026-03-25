---
title: Horizontal vs Vertical Scaling Strategy
impact: HIGH
impactDescription: Wrong scaling approach wastes 2-5x infrastructure budget
tags: scalability, infrastructure, cloud, performance
---

## Horizontal vs Vertical Scaling Strategy

Choosing the wrong scaling direction wastes budget and creates operational complexity. Match your scaling strategy to your actual bottleneck.

**Incorrect (scaling without diagnosis):**

```
"The app is slow, let's add more servers."
→ Problem was actually a single slow database query. More servers = more
  connections hitting the same slow query.

"Let's just get a bigger instance."
→ Problem was CPU-bound parallel processing. A bigger single machine
  doesn't help when work can be distributed.
```

**Correct (diagnose then scale):**

```
Step 1: Identify the bottleneck (CPU? Memory? I/O? Network?)
Step 2: Match scaling strategy to bottleneck type

CPU-bound, parallelizable work → Horizontal (more instances + load balancer)
Memory-bound (large dataset in RAM) → Vertical (bigger instance) or redesign
I/O-bound (database) → Read replicas + caching layer + query optimization
Single-threaded bottleneck → Vertical (faster CPU) + async processing
```

### Decision Matrix

| Bottleneck | First Try | Then Try | Avoid |
|-----------|-----------|----------|-------|
| Web server CPU | Horizontal scaling | CDN + caching | Bigger instance alone |
| Database reads | Read replicas + cache | Vertical scaling | Horizontal app only |
| Database writes | Write optimization | Sharding | Read replicas |
| Memory (app) | Code optimization | Vertical scaling | Horizontal (duplicates memory) |
| File storage | Object storage (S3) | CDN | Local disk scaling |

### Scaling Checklist (Before Adding Infrastructure)

1. ✅ Have you profiled to find the actual bottleneck?
2. ✅ Have you optimized queries/code first? (Often 10x cheaper)
3. ✅ Have you added caching where appropriate?
4. ✅ Is the application stateless? (Required for horizontal)
5. ✅ Do you have monitoring to validate improvement?

> "The cheapest server is the one you don't need. Optimize before you scale."
