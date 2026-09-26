# Architecture Decision

**Status:** Proposed baseline for validation, not an implemented architecture or ratified technology decision.
**Last reviewed:** 2026-09-26

## Context

The product is an internal system of record for sensitive employee, recruitment, project, time and financial information. It requires reliable relational integrity, server-side authorization, audit/history, on-premise operation, backup and executive reporting. The current repository is a static React/Vite prototype with browser-local state and a GitHub Pages deployment workflow; it is not a foundation for production records or security.

## Recommended direction

Evaluate a **modular monolith** with:

- ASP.NET Core 10 host and API boundary.
- SQL Server for normalized transactional data and migrations.
- Lightweight responsive SPA, potentially built as static assets and served by the same application.
- Explicit module ownership and cross-module contracts inside one deployable application.
- Internal/on-prem deployment, locally served assets, and AI/integrations as optional adapters.

This aligns deployment simplicity with clear API/UI separation and avoids distributed-system overhead at the expected initial scale. Confirm target environment support, licensing, operations, identity and client tooling before ratifying.

## Boundary sketch

```text
Browser / responsive SPA
        │ HTTPS, authenticated API
ASP.NET Core application
  ├─ Identity & Access
  ├─ People & Recruitment
  ├─ Projects & Work
  ├─ Resource Planning
  ├─ Time & Finance
  ├─ Audit & Reporting
  └─ Optional AI / Integration adapters
        │
SQL Server + approved document storage
```

Modules own their domain rules and persistence access. Begin with one deployable and a coherent database; avoid microservices, event brokers, distributed caches or generic workflow engines unless demonstrated needs justify them. Use database transactions for invariants that span a business operation. Introduce asynchronous/outbox patterns only for real integration/reliability needs.

## Security and operational guardrails

- Authenticate using the internally selected provider; do not implement production passwords in browser code.
- Authorize on the server for action and data scope; default deny and validate object-level access at every endpoint.
- Validate input at API boundaries and preserve database constraints.
- Keep secrets out of repository/config defaults; use environment/host secret management.
- Protect sensitive fields and logs; log security/business audit with retention and access controls.
- Use TLS, secure session/cookie policy, CSRF protection where cookie authentication applies, and explicit CORS policy.
- Define backup, restore tests, migrations, health/diagnostics, logging/monitoring and disaster recovery before production.
- Store dates/instants canonically with explicit timezone behavior; localize display, including Jalali UI, without treating formatted text as canonical time.
- Require tested KPI queries and authorized drill-down. AI components must not bypass permission checks or become authoritative data writers without an approved workflow.

## Alternatives and trade-offs

| Option | Assessment |
|---|---|
| Continue React/Vite prototype only | Useful for UX discovery; cannot meet multi-user integrity, server auth, audit or backup requirements |
| Modular monolith + ASP.NET Core/SQL Server | Recommended candidate: cohesive on-prem deployable, mature relational and API model; depends on environment/tooling validation |
| Separate SPA and API deployment | Viable if operations, independent release cadence or scaling justify it; adds hosting, CORS, deployment and operational surfaces |
| Microservices | Not justified by present team/scale/context; increases distributed data, observability and deployment complexity |
| Keep `localStorage` as operational persistence | Rejected for confidential/shared system-of-record use; acceptable only for disposable demo UI preferences/sample state |

## Consequences and next actions

- Migrate useful UI concepts, not prototype data/auth architecture.
- Establish backend solution, database/migrations, identity, authorization and test foundations before real data entry.
- Keep frontend selection and GitHub Pages purpose open; current Pages configuration is static prototype delivery, not internal deployment.
- Ratify this proposal only after answering environment, identity, SQL operations/licensing, and deployment questions in [OPEN_QUESTIONS.md](./OPEN_QUESTIONS.md).
