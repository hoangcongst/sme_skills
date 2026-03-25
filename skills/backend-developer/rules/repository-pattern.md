# Repository Pattern Rules

## BaseRepository Contract

All repositories extend `BaseRepository[ModelType, CreateSchemaType, UpdateSchemaType]`:

```python
class BaseRepository(Generic[ModelType, CreateSchemaType, UpdateSchemaType]):
    def __init__(self, db: Session, model: Type[ModelType]):
        self.db = db
        self.model = model

    def get(self, id: Any) -> Optional[ModelType]: ...
    def get_list(self, *, skip: int = 0, limit: int = 100) -> List[ModelType]: ...
    def create(self, *, obj_in: CreateSchemaType) -> ModelType: ...
    def update(self, *, db_obj: ModelType, obj_in: Union[UpdateSchemaType, Dict]) -> ModelType: ...
    def delete(self, *, id: Any) -> ModelType: ...
```

## Creating a New Repository

```python
from sqlalchemy.orm import Session
from app.models.{entity} import {Entity}
from app.repositories.base import BaseRepository
from app.schemas.{entity} import {Entity}Create, {Entity}Update

class {Entity}Repository(BaseRepository[{Entity}, {Entity}Create, {Entity}Update]):
    def __init__(self, db: Session):
        super().__init__(db, {Entity})

    # Entity-specific queries below
```

## Rules

1. **No Business Logic**: Repositories are pure data access. No `if` conditions based on domain rules.
2. **No HTTP Exceptions**: Return `None`, empty lists, or raise DB-specific errors. Let the service handle HTTP responses.
3. **Always Type Hint**: Return types must be explicit (`Optional[Model]`, `List[Model]`).
4. **Commit in Repository**: The base `create`, `update`, `delete` methods commit. Custom methods that modify data should also commit and refresh.
5. **Query Optimization**:
   - Use `joinedload()` for to-one relationships needed immediately
   - Use `selectinload()` for to-many relationships
   - Add `.options()` to queries to avoid N+1 problems
6. **Raw SQL**: Only when ORM generates suboptimal queries. Document why with a comment.

## Pagination in Repository

```python
def get_paginated(self, *, page: int = 1, size: int = 20, filters=None) -> tuple:
    query = self.db.query(self.model)
    if filters:
        query = query.filter(*filters)
    total = query.count()
    items = query.offset((page - 1) * size).limit(size).all()
    return items, total
```

## Complex Query Example

```python
def get_with_relations(self, id: int) -> Optional[{Entity}]:
    return (
        self.db.query(self.model)
        .options(
            joinedload(self.model.related_entity),
            selectinload(self.model.items),
        )
        .filter(self.model.id == id)
        .first()
    )
```
