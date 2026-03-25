---
title: Security by Design Principles
impact: HIGH
impactDescription: Fixing security after launch costs 10-100x more than designing it in
tags: security, authentication, authorization, owasp, zero-trust
---

## Security by Design Principles

Security must be embedded in architecture from day one, not bolted on after development.

**Incorrect (security as afterthought):**

```
"We'll add authentication later."
"Just store the API key in the .env file on the server."
"Admin users can access everything — we'll add granular permissions in v2."
"We trust internal services, no need for auth between them."
```

**Correct (security embedded in design):**

### Architecture Security Checklist

```
Authentication Layer
├── ✅ Use established identity providers (Auth0, Cognito, Firebase Auth)
├── ✅ JWT with short expiry (15 min) + refresh tokens
├── ✅ MFA for admin/sensitive operations
└── ❌ Never roll your own auth/crypto

Authorization Layer
├── ✅ RBAC or ABAC — defined at architecture level
├── ✅ Principle of least privilege by default
├── ✅ Permission checks at API gateway AND service level
└── ✅ Row-level security for multi-tenant data

Data Protection
├── ✅ Encryption at rest (AES-256) and in transit (TLS 1.3)
├── ✅ Secrets in vault (AWS Secrets Manager, HashiCorp Vault)
├── ✅ PII handling: minimize collection, encrypt, audit access
└── ✅ Database: parameterized queries only (prevent SQL injection)

API Security
├── ✅ Rate limiting per user/IP
├── ✅ Input validation at API boundary (whitelist, not blacklist)
├── ✅ CORS configured explicitly (no wildcard in production)
└── ✅ Request size limits to prevent abuse
```

### OWASP Top 10 Architecture Mitigations

| Risk | Architectural Mitigation |
|------|-------------------------|
| Injection | Parameterized queries, ORM, input validation layer |
| Broken Auth | Identity provider, JWT rotation, session management |
| Sensitive Data Exposure | Encryption at rest/transit, field-level encryption for PII |
| Broken Access Control | RBAC at gateway, service-level authorization middleware |
| Security Misconfiguration | Infrastructure-as-code, security scanning in CI/CD |
| XSS | CSP headers, output encoding, template auto-escaping |

### Zero-Trust Checklist for Internal Services

```
Even internal service-to-service calls should:
├── ✅ Authenticate (mTLS or service tokens)
├── ✅ Authorize (which service can call which endpoint)
├── ✅ Encrypt (TLS, even in private networks)
└── ✅ Log (audit trail for all cross-service calls)
```

> "Assume breach. Design every layer as if the layer above it has been compromised."

Reference: [OWASP Top 10](https://owasp.org/www-project-top-ten/)
