# Testing Strategy Rules

## Layer-Specific Testing

### Repository Tests — Real Database

Test against a real test database to verify SQL/ORM correctness:

```python
# tests/test_repositories/test_{entity}_repository.py
import pytest
from app.repositories.{entity}_repository import {Entity}Repository

class Test{Entity}Repository:
    def test_create(self, db_session):
        repo = {Entity}Repository(db_session)
        created = repo.create(obj_in={Entity}Create(name="test"))
        assert created.id is not None
        assert created.name == "test"

    def test_get_by_field(self, db_session):
        repo = {Entity}Repository(db_session)
        repo.create(obj_in={Entity}Create(name="unique"))
        result = repo.get_by_field("unique")
        assert result is not None
        assert result.name == "unique"

    def test_get_by_field_not_found(self, db_session):
        repo = {Entity}Repository(db_session)
        result = repo.get_by_field("nonexistent")
        assert result is None
```

### Service Tests — Mock Repositories

Test business logic in isolation by mocking the repository:

```python
# tests/test_services/test_{entity}_service.py
import pytest
from unittest.mock import MagicMock, patch
from fastapi import HTTPException
from app.services.{entity}_service import {Entity}Service

class Test{Entity}Service:
    def setup_method(self):
        self.mock_repo = MagicMock()
        self.service = {Entity}Service(repository=self.mock_repo)

    def test_create_success(self):
        self.mock_repo.get_by_field.return_value = None
        self.mock_repo.create.return_value = mock_{entity}
        result = self.service.create_{entity}(obj_in=create_data)
        self.mock_repo.create.assert_called_once()

    def test_create_duplicate_raises_400(self):
        self.mock_repo.get_by_field.return_value = existing_{entity}
        with pytest.raises(HTTPException) as exc_info:
            self.service.create_{entity}(obj_in=create_data)
        assert exc_info.value.status_code == 400

    def test_get_or_404_not_found(self):
        self.mock_repo.get.return_value = None
        with pytest.raises(HTTPException) as exc_info:
            self.service.get_or_404(999)
        assert exc_info.value.status_code == 404
```

### Endpoint Tests — Mock Services

Test HTTP layer using `TestClient` with mocked services:

```python
# tests/test_endpoints/test_{entities}.py
import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.dependencies.providers import get_{entity}_service

class Test{Entity}Endpoints:
    def setup_method(self):
        self.mock_service = MagicMock()
        app.dependency_overrides[get_{entity}_service] = lambda: self.mock_service
        self.client = TestClient(app)

    def teardown_method(self):
        app.dependency_overrides.clear()

    def test_create_returns_201(self):
        self.mock_service.create_{entity}.return_value = mock_response
        response = self.client.post("/{entities}/", json={...})
        assert response.status_code == 201

    def test_get_returns_404(self):
        self.mock_service.get_or_404.side_effect = HTTPException(status_code=404)
        response = self.client.get("/{entities}/999")
        assert response.status_code == 404
```

## Test Configuration

```ini
# pytest.ini
[pytest]
testpaths = tests
python_files = test_*.py
python_classes = Test*
python_functions = test_*
```

## Rules

1. **Each layer is tested independently** — never test through the full stack unless it's an integration test
2. **Repositories use real DB** — that's their whole purpose
3. **Services mock repositories** — test business logic, not SQL
4. **Endpoints mock services** — test HTTP contracts, not business logic
5. **Use `dependency_overrides`** — FastAPI's built-in DI override for endpoint tests
6. **Clean up overrides** — `app.dependency_overrides.clear()` in teardown
7. **Test both happy and error paths** — every HTTPException has a test
