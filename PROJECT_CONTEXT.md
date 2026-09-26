# Project Context

**Baseline provided:** 2026-09-21
**Repository/documentation review:** 2026-09-26
**Status:** Product direction and organization context supplied by the project owner; implementation status is separately recorded in [CURRENT_STATE.md](./CURRENT_STATE.md).

## Mission

Build a secure, lightweight, clean, extensible internal system for a project-oriented software/consulting company with an AI focus. It should track the employee lifecycle, resource allocation, projects, WBS/tasks, time, budgets, costs, progress, deviations, and management status. Its purpose is not merely data entry: it should create a trusted, shared operational picture of People, Resources, and Projects for management decisions.

## Organization context

- The company is recruiting and has approximately ten current or expected employees in the planning context.
- Approximately five to seven people are associated with Python/Bot/Agent work.
- Offices in Tehran and Dubai are in scope; two Indian staff members in the Dubai office have been mentioned.
- Projects are mainly medium-term and externally sourced.
- Employees may work on multiple projects simultaneously; each project may involve multiple employees.
- These are planning assumptions supplied for product design, not verified live data. Confirm them before loading production records.

## Product scope

### Phase 1 — internal operational foundation

Local/on-premise deployment; user-driven entry; internal authentication; role, permission, and data-scope enforcement; employees and recruitment; projects and assignments; tasks/WBS; time; budgets and costs; audit/history; executive dashboard; actionable alerts; and backup/restore.

### Future, optional capabilities

Smart workflows, RAG, internal AI models, AI assistant/agents, integrations, recommendations, and anomaly detection. AI must be replaceable and optional over a useful operational core; the system must remain usable if AI features are disabled.

## Product principles

- MVP-first, production-minded foundation; avoid prototype-only architecture and premature complexity.
- No God Class/object, giant service/controller/component, or generic universal entity model.
- Minimize runtime dependencies; prefer local assets and responsive/mobile-first interfaces.
- Optimize dashboards for executive clarity, low visual density, drill-down, and valid decisions.
- Integrity, traceability, and a single source of truth take precedence over decorative KPIs.
- Model history and audit intentionally; use standard, well-understood patterns.
- UI visibility is not a security boundary. Backend authorization must check both operation permission and allowed data scope.
- `Employee` and `UserAccount` are distinct concepts.
- Use internal database identifiers distinct from human/business codes (for example `EmployeeId` and `EmployeeCode`).
- Do not store employee project history as a duplicated mutable list; derive it from effective-dated assignments.

## Preferred architecture direction

The baseline to evaluate is a **modular monolith + ASP.NET Core 10 + SQL Server + API boundary + lightweight SPA**, deployed as one internal application. The SPA may be hosted as static assets by the ASP.NET Core host. This is a direction for architecture review, not proof of an existing backend or a final decision. Frontend framework/toolchain, identity provider, hosting environment, and compatibility must be validated before implementation.

## Delivery strategy

Build through vertical slices rather than disconnected backend and frontend phases:

`Documentation → Domain → Data → API → Authentication/Authorization → UI → Tests → Verification → Documentation`

Start with foundation and Identity/Employee, not a dashboard-first implementation. Chat is transient; repository documents are the durable project memory.
