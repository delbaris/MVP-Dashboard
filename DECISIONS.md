# Decisions and Decision Log

This log distinguishes confirmed product principles from recommended but unratified design directions. A proposal is not a decision. Add date, owner/authority, context, alternatives, and consequences when ratifying consequential choices.

## Current product principles

| ID | Statement | Status |
|---|---|---|
| P-001 | AI remains optional and replaceable; operational workflows must work without AI. | Confirmed project principle |
| P-002 | Employee/person record and login account are separate concepts. | Confirmed project principle |
| P-003 | Backend authorization enforces operation permission and data scope; UI visibility is insufficient. | Confirmed project principle |
| P-004 | ProjectAssignment is a first-class, effective-dated, allocation-aware relationship; employee project history is derived. | Confirmed project principle |
| P-005 | Approved/valid TimeEntry records are the source for actual time, subject to company approval policy. | Confirmed direction; approval details open |
| P-006 | Important changes preserve business history and technical audit as distinct concepts. | Confirmed project principle |
| P-007 | Prefer a modular monolith and internal/on-prem deployment over unnecessary distributed infrastructure. | Confirmed preference, subject to environment validation |
| P-008 | Track durable project Markdown in Git; do not ignore `*.md` broadly. | Applied repository documentation policy |
| P-009 | Manager feedback prioritizes a mobile-first executive home KPI order and requests a selectable Gantt above (not replacing) existing project-detail sections. | Confirmed UX priority; formulas, date sources, permissions and detailed interactions remain open |

## Architecture recommendation (not ratified)

**ADR-001 — Proposed:** modular monolith using ASP.NET Core 10, SQL Server, a versioned API boundary, and lightweight SPA assets hosted by the same internal application.

- **Status:** Proposed; validate with environment/operations owner before adopting.
- **Why it fits:** one deployable internal system, clear UI/API boundary, relational integrity, and module boundaries without introducing microservices or a separate SPA hosting tier by default.
- **Still open:** exact .NET/runtime availability, hosting and backup/restore, SQL Server licensing/operations, frontend build/tooling, authentication provider, API versioning, and authorization model.
- **Alternatives to assess:** retain a browser-only prototype temporarily; separate SPA/API deployment only where justified; alternative database/identity technology if constraints require.

## Decisions deliberately not made

- The authoritative employment, candidate, project, task, approval, and closure status vocabularies.
- Identity provider, account provisioning, MFA, session and password policy.
- Fine-grained role/permission/data-scope matrix.
- Currency, tax/accounting treatment, cost-rate privacy and effective-date rules.
- Time approval, corrections, leave, overtime, rounding and time-zone rules.
- Project progress formula, task weighting, manual override and approval/audit requirements.
- Soft deletion, retention, legal hold, document storage and personal-data retention.
- Dashboard KPI definitions, thresholds, refresh cadence and alert ownership.

See [OPEN_QUESTIONS.md](./OPEN_QUESTIONS.md) for decision questions and [DOCUMENTATION_GOVERNANCE.md](./DOCUMENTATION_GOVERNANCE.md) for updates.
