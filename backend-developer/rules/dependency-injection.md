# Dependency Injection Rules

## Overview

All dependency wiring lives in `app/dependencies/providers.py`. We leverage FastAPI's `Depends()` system to achieve loose coupling between layers.

## Provider Registration Pattern

### Repository Provider

```python
def get_{entity}_repository(db: Session = Depends(get_db)):
    """Dependency that returns a {Entity}Repository instance"""
    return {Entity}Repository(db)
```

### Service Provider (Simple)

```python
def get_{entity}_service(
    repo: {Entity}Repository = Depends(get_{entity}_repository),
) -> {Entity}Service:
    """Dependency that returns a {Entity}Service instance"""
    return {Entity}Service(repo)
```

### Service Provider (Complex — Multiple Dependencies)

```python
def get_order_service(
    order_repo: OrderRepository = Depends(get_order_repository),
    product_repo: ProductRepository = Depends(get_product_repository),
    payment_service: PaymentService = Depends(get_payment_service),
    db: Session = Depends(get_db),
) -> OrderService:
    """Dependency that returns an OrderService instance"""
    return OrderService(
        repository=order_repo,
        product_repo=product_repo,
        payment_service=payment_service,
        db=db,
    )
```

## Rules

1. **One Provider Per Class**: Each repository and service gets exactly one factory function.
2. **Always Type Annotate Return**: `-> {Entity}Service` for clarity and IDE support.
3. **Always Add Docstring**: `"""Dependency that returns a {Entity}Service instance"""`
4. **Order in File**: Repository providers first, then service providers. Group by domain.
5. **No Business Logic in Providers**: Providers are pure factory functions.
6. **Use Named Parameters**: When services have multiple deps, use keyword arguments in the constructor call.

## Using in Endpoints

```python
@router.get("/{id}", response_model={Entity}Response)
async def get_{entity}(
    id: int,
    current_user: User = Depends(get_current_user),
    service: {Entity}Service = Depends(get_{entity}_service),
):
    return service.get_or_404(id)
```

## Testing Override

```python
# Override dependency for testing
app.dependency_overrides[get_{entity}_service] = lambda: mock_service
```

## Checklist for New Feature

When adding a new feature, register in `providers.py`:
- [ ] `get_{entity}_repository()` 
- [ ] `get_{entity}_service()`
- [ ] Import both at the top of `providers.py`
