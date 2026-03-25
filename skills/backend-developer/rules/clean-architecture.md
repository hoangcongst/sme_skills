# Clean Architecture Rules

## Layer Boundaries (Strict Enforcement)

### API Layer → Service Layer → Repository Layer → Domain

This is the **only** valid dependency direction. Never skip layers.

### Violations That Must Be Caught:

```python
# ❌ VIOLATION: Endpoint calling repository directly
@router.get("/{id}")
async def get_item(id: int, db: Session = Depends(get_db)):
    return db.query(Item).filter(Item.id == id).first()

# ✅ CORRECT: Endpoint delegates to service
@router.get("/{id}", response_model=ItemResponse)
async def get_item(
    id: int,
    service: ItemService = Depends(get_item_service),
):
    return service.get_or_404(id)
```

```python
# ❌ VIOLATION: Service importing Request or returning JSONResponse
from fastapi import Request
class ItemService:
    def get_item(self, request: Request): ...

# ✅ CORRECT: Service is HTTP-agnostic
class ItemService:
    def get_item(self, item_id: int) -> Item: ...
```

```python
# ❌ VIOLATION: Repository containing business logic
class ItemRepository:
    def create(self, obj_in):
        if self.get_by_name(obj_in.name):  # Business rule!
            raise HTTPException(...)
        ...

# ✅ CORRECT: Repository only does data access
class ItemRepository:
    def get_by_name(self, name: str) -> Optional[Item]:
        return self.db.query(self.model).filter(self.model.name == name).first()
```

## Dependency Injection Contract

- Services receive repositories via **constructor injection** in `providers.py`
- Services **never** call `get_db()` directly (exception: legacy services being refactored)
- Complex services may depend on **multiple repositories** and **other services**
- All new dependencies must be registered in `app/dependencies/providers.py`

## File Naming Convention

| Layer | File Pattern | Class Pattern |
|-------|-------------|---------------|
| Model | `app/models/{entity}.py` | `{Entity}` |
| Repository | `app/repositories/{entity}_repository.py` | `{Entity}Repository` |
| Service | `app/services/{entity}_service.py` | `{Entity}Service` |
| Schema | `app/schemas/{entity}.py` | `{Entity}Create`, `{Entity}Update`, `{Entity}Response` |
| Endpoint | `app/api/v1/endpoints/{entities}.py` | `router = APIRouter()` |
| Provider | `app/dependencies/providers.py` | `get_{entity}_repository()`, `get_{entity}_service()` |

## Refactoring Legacy Code

When encountering code that violates these rules:

1. **Isolate**: Pick one feature at a time
2. **Build Foundation**: Create Repository + Service for that feature
3. **Switch**: Refactor endpoint to use Service via DI
4. **Verify**: Run all tests
5. **Repeat**: Move to next feature

Never refactor everything at once. Feature-by-feature only.
