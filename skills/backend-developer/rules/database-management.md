# Database Management Rules

## ORM First

Use SQLAlchemy for all standard operations. Raw SQL only for performance-critical queries that ORM cannot optimize.

## Model Definition

```python
# app/models/{entity}.py
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Boolean, Index
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.db.base import Base

class {Entity}(Base):
    __tablename__ = "{entities}"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    name = Column(String(255), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())

    # Relationships
    user = relationship("User", back_populates="{entities}")

    # Indexes for frequently queried columns
    __table_args__ = (
        Index("ix_{entities}_user_id_created", "user_id", "created_at"),
    )
```

## Migrations (Alembic)

**Every** schema change goes through Alembic:

```bash
# Generate migration
alembic revision --autogenerate -m "add {entity} table"

# Apply migration
alembic upgrade head

# Rollback
alembic downgrade -1
```

### Rules:
1. **Never** modify the database manually
2. **Always** review auto-generated migrations before applying
3. **Always** make migrations reversible (include `downgrade`)
4. **One migration per logical change** (don't batch unrelated changes)

## Query Optimization

### Preventing N+1

```python
# ❌ N+1 Problem
users = db.query(User).all()
for user in users:
    print(user.posts)  # Each triggers a separate query!

# ✅ Eager Loading
users = db.query(User).options(
    selectinload(User.posts)
).all()
```

### Index Strategy

- Primary keys: automatic
- Foreign keys: always index (`index=True` or explicit `Index`)
- Columns in `WHERE` clauses: index
- Columns in `ORDER BY` with `LIMIT`: index
- Composite indexes for multi-column filters

### query.count() vs len()

```python
# ✅ Efficient: DB counts
total = db.query(Model).filter(...).count()

# ❌ Wasteful: Loads all rows then counts in Python
total = len(db.query(Model).filter(...).all())
```

## Transactions

```python
# For complex multi-step operations
try:
    item1 = repo.create(obj_in=item1_data)
    item2 = repo.create(obj_in=item2_data)
    db.commit()
except Exception:
    db.rollback()
    raise
```

## Connection Pooling

Configured in `app/db/session.py`:
- Pool size appropriate for workload
- Connection timeout configured
- Session cleanup via `get_db()` dependency with `finally: db.close()`
