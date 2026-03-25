# Background Tasks Rules

## Architecture: Sentry-Like Dedicated Workers

```
┌─────────────────────────────────────────┐
│   Celery Broker (Redis/RabbitMQ/SQS)    │
└─────────────────────────────────────────┘
         │           │           │
         ▼           ▼           ▼
┌─────────────┐ ┌─────────────┐ ┌─────────────┐
│  analytics  │ │    email    │ │   export    │
│   worker    │ │   worker    │ │   worker    │
│ (3 replicas)│ │ (2 replicas)│ │ (1 replica) │
└─────────────┘ └─────────────┘ └─────────────┘
```

Each task type is a **dedicated deployment** with independent scaling.

## Adding a New Worker

### Step 1: Create Task File

```python
# app/celery_app/tasks/{task_type}.py
from celery import shared_task
from app.celery_app.base import DatabaseTask

@shared_task(bind=True, base=DatabaseTask, name="{task_type}.{action}")
def process_{action}(self, entity_id: int, **kwargs):
    """Process {action} in background."""
    with self.get_db() as db:
        # Task logic here
        ...
```

### Step 2: Add Task Route

```python
# In celery config
task_routes = {
    "app.celery_app.tasks.{task_type}.*": {"queue": "{task_type}"},
}
```

### Step 3: Create K8s Deployment

```bash
cp k8s/worker-analytics.yaml k8s/worker-{task_type}.yaml
# Change: name, queue (-Q {task_type}), replicas
```

### Step 4: Deploy

```bash
kubectl apply -f k8s/worker-{task_type}.yaml
kubectl scale deployment worker-{task_type} --replicas=N
```

## Running Locally

```bash
celery -A app.celery_app worker -Q {queue_name} -c 4 -l INFO
```

## Rules

1. **Broker-Agnostic**: Configuration supports Redis, RabbitMQ, and SQS interchangeably.
2. **Dedicated Queues**: Each task type gets its own queue for independent scaling.
3. **Idempotency**: Tasks must be safe to retry without side effects.
4. **Error Handling**: Use `bind=True` and `self.retry()` for transient failures.
5. **Database Sessions**: Use `DatabaseTask` base class for DB access within tasks.
6. **Event Emission**: Use `@track_activity` in the **Service Layer**, not in tasks.
7. **Celery Beat**: Always run exactly 1 replica for scheduled tasks.

## Environment Variables

| Variable | Example |
|----------|---------|
| `CELERY_BROKER_URL` | `redis://redis:6379/0` |
| `DATABASE_URL` | `postgresql://...` |
