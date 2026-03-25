# API Conventions Rules

## Endpoint Design

### Thin Handlers (Maximum 5-10 Lines)

```python
@router.post("/", response_model={Entity}Response, status_code=status.HTTP_201_CREATED)
async def create_{entity}(
    *,
    obj_in: {Entity}Create,
    current_user: User = Depends(get_current_user),
    service: {Entity}Service = Depends(get_{entity}_service),
):
    """Create a new {entity}."""
    return service.create_{entity}(obj_in=obj_in)
```

### Route Naming Convention

| Operation | Method | Path | Status Code |
|-----------|--------|------|-------------|
| List | `GET` | `/{entities}` | 200 |
| Get one | `GET` | `/{entities}/{id}` | 200 |
| Get current user's | `GET` | `/{entities}/me` | 200 |
| Create | `POST` | `/{entities}` | 201 |
| Update | `PUT` | `/{entities}/{id}` | 200 |
| Partial update | `PATCH` | `/{entities}/{id}` | 200 |
| Delete | `DELETE` | `/{entities}/{id}` | 200 or 204 |

### File Naming

- Endpoint files use **plural** names: `users.py`, `attempts.py`, `vocabulary_notebooks.py`
- One file per resource domain

## Authentication

```python
# Regular user access
current_user: User = Depends(get_current_user)

# Admin-only access
current_user: User = Depends(get_current_admin_user)

# OAuth scope-based access
current_user: User = Depends(require_scope_if_oauth("read:profile"))
```

## Router Registration

In `app/api/v1/router.py`:

```python
from app.api.v1.endpoints import {entities}

api_router.include_router(
    {entities}.router,
    prefix="/{entities}",
    tags=["{entities}"],
)
```

## Rules

1. **Always Use `response_model`**: Auto-serialization + API docs.
2. **Always Use `status_code`**: Explicit for POST (201), DELETE (200/204).
3. **Always Add Docstrings**: Every endpoint needs a clear docstring for OpenAPI docs.
4. **Consistent Pagination**: Use `skip`/`limit` query params for list endpoints.
5. **No DB Objects in Responses**: Let `response_model` handle serialization via Pydantic.
6. **Authorization Logic**: Simple checks (current user owns resource) can stay in endpoint. Complex checks go to service.

## Error Response Format

Consistent JSON structure:

```json
{
    "detail": "Human-readable error message"
}
```

For validation errors (auto-handled by FastAPI):

```json
{
    "detail": [
        {
            "loc": ["body", "field_name"],
            "msg": "field required",
            "type": "value_error.missing"
        }
    ]
}
```
