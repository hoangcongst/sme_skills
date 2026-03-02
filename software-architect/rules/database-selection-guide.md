---
title: Database Selection Decision Framework
impact: HIGH
impactDescription: Wrong DB choice creates 6-12 month migration debt
tags: database, sql, nosql, data-architecture, selection
---

## Database Selection Decision Framework

Database choice is one of the hardest decisions to reverse. Use this framework to match your data characteristics to the right engine.

**Incorrect (hype-driven selection):**

```
"MongoDB is webscale, let's use it for everything."
→ Your data is highly relational with complex joins. Now you're doing
  application-level joins across collections. 10x slower.

"PostgreSQL for everything."
→ Your time-series IoT data needs 100k writes/sec with auto-expiry.
  PostgreSQL can do it but a purpose-built TSDB is 50x more efficient.
```

**Correct (requirement-driven selection):**

```
Step 1: Characterize your data
- Structure: Fixed schema? Flexible? Graph relationships?
- Access patterns: Read-heavy? Write-heavy? Both?
- Consistency: Strong (financial)? Eventual (social feed)?
- Scale: GB? TB? PB?
- Queries: Complex joins? Key-value lookups? Full-text search?

Step 2: Match to engine
```

### Selection Matrix

| Data Characteristic | Best Fit | Examples |
|--------------------|----------|---------|
| Relational, ACID, complex queries | Relational DB | PostgreSQL, MySQL |
| Document-oriented, flexible schema | Document DB | MongoDB, Firestore |
| Key-value, ultra-low latency | Key-Value Store | Redis, DynamoDB |
| Time-series, high write volume | Time-Series DB | TimescaleDB, InfluxDB |
| Graph relationships (social, fraud) | Graph DB | Neo4j, Amazon Neptune |
| Full-text search, analytics | Search Engine | Elasticsearch, Meilisearch |
| Wide column, massive scale | Column Store | Cassandra, ScyllaDB |

### The "Start with PostgreSQL" Rule

When in doubt, **start with PostgreSQL**. It handles:
- Relational data (its core strength)
- JSON documents (`jsonb` — flexible schema when needed)
- Full-text search (good enough for most apps)
- Time-series (with TimescaleDB extension)
- Geospatial (PostGIS)

**Add specialized databases only when PostgreSQL becomes the bottleneck** for a specific workload.

### Multi-Database Strategy

```
Typical SaaS Architecture:
├── PostgreSQL      → Primary data (users, orders, products)
├── Redis           → Caching, sessions, real-time features
├── Elasticsearch   → Search, logging (if needed)
└── S3              → Files, media, backups
```

> "Use the right tool for the job, but remember: fewer tools = fewer operational headaches."

Reference: [DB-Engines Ranking](https://db-engines.com/en/ranking)
