---
title: API Testing Best Practices
impact: HIGH
impactDescription: API tests catch 60% of bugs that unit tests miss
tags: api, testing, contract, integration, automation
---

## API Testing Best Practices

API tests are the most cost-effective tests — fast to run, stable, and catch real bugs.

### What to Test at the API Level

| Test Type | What It Validates | Example |
|-----------|------------------|---------|
| **Happy Path** | Expected flow works | POST /orders → 201 with order data |
| **Validation** | Bad input is rejected | POST /orders with empty body → 422 |
| **Auth** | Protected routes require auth | GET /orders without token → 401 |
| **Authorization** | Users can't access others' data | GET /users/456/orders as user 123 → 403 |
| **Edge Cases** | Boundary values, empty lists | GET /orders for new user → 200 with empty array |
| **Error Responses** | Error format is consistent | 404 returns `{ error: { code, message } }` |

### Test Structure

```python
# ✅ Pytest example with clear structure
class TestOrdersAPI:
    """Tests for POST /api/v1/orders"""

    async def test_create_order_success(self, client, auth_headers, test_product):
        """Happy path: authenticated user creates order"""
        response = await client.post(
            "/api/v1/orders",
            json={"product_id": test_product.id, "quantity": 2},
            headers=auth_headers,
        )

        assert response.status_code == 201
        data = response.json()["data"]
        assert data["product_id"] == test_product.id
        assert data["quantity"] == 2
        assert data["status"] == "pending"
        assert "id" in data

    async def test_create_order_unauthenticated(self, client):
        """Auth: rejects unauthenticated requests"""
        response = await client.post(
            "/api/v1/orders",
            json={"product_id": "abc", "quantity": 1},
        )
        assert response.status_code == 401

    async def test_create_order_invalid_quantity(self, client, auth_headers):
        """Validation: rejects invalid quantity"""
        response = await client.post(
            "/api/v1/orders",
            json={"product_id": "abc", "quantity": -1},
            headers=auth_headers,
        )
        assert response.status_code == 422
        error = response.json()["error"]
        assert error["code"] == "VALIDATION_ERROR"
        assert any(d["field"] == "quantity" for d in error["details"])

    async def test_create_order_nonexistent_product(self, client, auth_headers):
        """Edge case: product doesn't exist"""
        response = await client.post(
            "/api/v1/orders",
            json={"product_id": "nonexistent", "quantity": 1},
            headers=auth_headers,
        )
        assert response.status_code == 404
```

### API Test Checklist (Per Endpoint)

- [ ] Happy path returns expected status code and response shape
- [ ] Required fields validated (400/422 for missing fields)
- [ ] Invalid data types rejected (string for number, etc.)
- [ ] Authentication required (401 without token)
- [ ] Authorization enforced (403 for wrong user/role)
- [ ] Not found returns 404 (not 500)
- [ ] Pagination works correctly (first page, last page, empty page)
- [ ] Rate limiting returns 429
- [ ] Response matches API documentation/schema

### Contract Testing

```python
# ✅ Validate response against OpenAPI schema
from openapi_schema_validator import validate

def test_response_matches_schema(response):
    schema = load_openapi_spec("openapi.yaml")
    endpoint_schema = schema["paths"]["/api/v1/orders"]["post"]["responses"]["201"]
    validate(response.json(), endpoint_schema["content"]["application/json"]["schema"])
```
