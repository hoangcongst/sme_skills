---
title: RESTful API Design Conventions
impact: CRITICAL
impactDescription: Consistent APIs reduce integration bugs by 40-60%
tags: api, rest, http, conventions
---

## RESTful API Design Conventions

Consistent, predictable APIs dramatically reduce integration time and bugs. Follow these conventions for all REST endpoints.

**Incorrect:**

```
POST /api/getUsers              # Wrong verb for retrieval
GET /api/user/delete/123        # GET with side effects
POST /api/createNewOrder        # Verb in URL
GET /api/users?page=1           # No total count, no next/prev links

Response: { "data": [...], "error": null }  # Inconsistent error handling
Response: 200 OK { "success": false, "message": "Not found" }  # Wrong status code
```

**Correct:**

```
GET    /api/v1/users             # Collection
GET    /api/v1/users/123         # Single resource
POST   /api/v1/users             # Create
PUT    /api/v1/users/123         # Full update
PATCH  /api/v1/users/123         # Partial update
DELETE /api/v1/users/123         # Delete

# Nested resources (max 2 levels)
GET    /api/v1/users/123/orders

# Filtering, sorting, pagination
GET    /api/v1/users?status=active&sort=-created_at&page=2&per_page=20

# Consistent response envelope
{
  "data": [...],
  "meta": { "total": 150, "page": 2, "per_page": 20 },
  "links": { "next": "/api/v1/users?page=3", "prev": "/api/v1/users?page=1" }
}

# Error response with proper HTTP status
404 Not Found
{
  "error": {
    "code": "RESOURCE_NOT_FOUND",
    "message": "User with ID 123 not found",
    "details": []
  }
}
```

### Versioning Strategy

| Strategy | Use When | Example |
|----------|----------|---------|
| URL path | Public APIs, clear separation | `/api/v1/users` |
| Header | Internal APIs, fine-grained control | `Accept: application/vnd.api.v2+json` |

### HTTP Status Code Guide

| Code | When to Use |
|------|------------|
| 200 | Successful GET, PUT, PATCH |
| 201 | Successful POST (resource created) |
| 204 | Successful DELETE (no content) |
| 400 | Validation error, malformed request |
| 401 | Not authenticated |
| 403 | Authenticated but not authorized |
| 404 | Resource not found |
| 409 | Conflict (duplicate, version mismatch) |
| 422 | Semantically invalid (business rule violation) |
| 429 | Rate limited |
| 500 | Unexpected server error |

Reference: [Microsoft REST API Guidelines](https://github.com/microsoft/api-guidelines)
