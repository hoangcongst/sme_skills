# Service Pattern Rules

## BaseService Contract

All services extend `BaseService[ModelType, CreateSchemaType, UpdateSchemaType]`:

```python
class BaseService(Generic[ModelType, CreateSchemaType, UpdateSchemaType]):
    def __init__(self, repository: Any):
        self.repository = repository

    def get(self, id: Any) -> Optional[ModelType]: ...
    def get_or_404(self, id: Any) -> ModelType: ...      # Raises HTTPException(404)
    def get_list(self, *, skip: int = 0, limit: int = 100) -> List[ModelType]: ...
    def create(self, *, obj_in: CreateSchemaType) -> ModelType: ...
    def update(self, *, id: Any, obj_in: Union[UpdateSchemaType, Dict]) -> ModelType: ...
    def delete(self, *, id: Any) -> ModelType: ...
```

## Creating a New Service

```python
from fastapi import HTTPException, status
from app.repositories.{entity}_repository import {Entity}Repository
from app.schemas.{entity} import {Entity}Create, {Entity}Update
from app.services.base import BaseService
from app.models.{entity} import {Entity}

class {Entity}Service(BaseService[{Entity}, {Entity}Create, {Entity}Update]):
    def __init__(self, repository: {Entity}Repository):
        super().__init__(repository)
        self.repository = repository  # Re-assign for proper type hints

    def create_{entity}(self, obj_in: {Entity}Create) -> {Entity}:
        """Create a new {entity} with business validation."""
        # Business rule: check uniqueness
        existing = self.repository.get_by_field(obj_in.field)
        if existing:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="{Entity} already exists"
            )
        return self.repository.create(obj_in=obj_in)
```

## Rules

1. **All Business Logic Here**: Uniqueness checks, state transitions, access control, calculation — all in the service.
2. **Use `get_or_404()`**: Always use the inherited helper for existence checks before operations.
3. **HTTP Exceptions Allowed**: Services raise `HTTPException` with proper status codes and messages.
4. **No HTTP Imports Besides HTTPException**: No `Request`, `Response`, `JSONResponse` in services.
5. **No Direct DB Access**: Never import `Session` or `get_db`. Access DB only through the injected repository.
6. **Re-assign `self.repository`**: After `super().__init__()`, re-assign for proper IDE support.

## Service Composition

Complex services can depend on multiple repositories and other services:

```python
class OrderService(BaseService[Order, OrderCreate, OrderUpdate]):
    def __init__(
        self,
        repository: OrderRepository,
        product_repo: ProductRepository,
        payment_service: PaymentService,
        db: Session,  # Only when transaction management is required
    ):
        super().__init__(repository)
        self.repository = repository
        self.product_repo = product_repo
        self.payment_service = payment_service
        self.db = db
```

## Validation Layers

```
Schema Level (Pydantic):     Types, lengths, formats, regex
Service Level (Business):    Uniqueness, state, permissions, cross-field rules
```

**Never** validate business rules in schemas. **Never** validate types in services.

## Analytics & Events

Use `@track_activity` decorator in the Service Layer:

```python
@track_activity("completed_test")
def submit_attempt(self, user_id: int, attempt_in: AttemptCreate):
    ...
```

**NEVER** emit events from endpoints. Always from services.
