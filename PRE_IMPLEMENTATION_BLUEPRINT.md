# Pre-Implementation Blueprint

This blueprint sequences discovery and delivery; it is not a declaration that the target stack has been ratified. First settle blocking items in [OPEN_QUESTIONS.md](./OPEN_QUESTIONS.md), then keep backend and UI work integrated through vertical slices.

## 0. Ratify constraints and policies

- Confirm target .NET/runtime, SQL Server, deployment host, network restrictions, backup operations and support ownership.
- Confirm identity source, account lifecycle, permission/data-scope model, sensitive fields and audit requirements.
- Agree lifecycle vocabularies, timezone/currency, time approval, rate/cost rules and project-progress policy.
- Resolve the manager-feedback questions for gross revenue, total budget/cost aggregation, executive issue triage, meeting privacy/source, role-specific landing pages, and project Gantt source/interactions.
- Establish a mobile viewport/accessibility acceptance matrix. A clearly labeled synthetic-data UI prototype is now in place; agree which of its flows should carry into production after backend and policy design.
- Define MVP acceptance scenarios, initial roles, data import needs and nonfunctional targets.

**Exit:** recorded decisions and owners; unresolved assumptions are explicit.

## 1. Establish delivery foundation

- Create solution/repository layout for the chosen modular monolith; establish configuration, secrets, logging, health, exception handling and environment profiles.
- Establish SQL Server connectivity, migrations, repeatable local setup and test database strategy.
- Define API conventions, validation/error contract, OpenAPI generation, versioning policy and SPA/API hosting boundary.
- Establish CI for restore, build, tests, static analysis and production artifact; decide whether GitHub Pages remains preview-only.
- Define backup/restore and migration rollback/forward operational procedures.

**Exit:** a reproducible, tested empty deployment skeleton with no secrets in source control.

## 2. First vertical slice — identity and employee foundation

Implement one end-to-end slice: account authentication/provisioning; Employee independent of UserAccount; authorized employee list/detail; office/team/position and core status; server-side validation; API and database migration; responsive Persian UI; audit/history for approved important changes; and unit/integration/UI tests including denied access.

**Exit:** a real persisted employee record is readable/writable only within its permitted scope; UI and API enforce the same policy.

## 3. Recruitment and employee lifecycle

Add source, candidate, interview/evaluation, decision/offer and conversion to employee while retaining recruitment history. Add onboarding and historically traceable transitions into available/unassigned status. Do not collapse candidate and employee into a single mutable record.

**Exit:** lifecycle transitions and history rules are tested; owners and retention decisions are known.

## 4. Project, WBS and assignment

Add project intake and status transitions; WBS structure; task ownership, dependencies and DoD; effective-dated ProjectAssignment; capacity validation and employee history derived from assignments.

**Exit:** changes to staffing and task/project lifecycle remain historically explainable and integrity-checked.

## 5. Time, budget and progress

Add timesheets/entries, submission/approval/correction; distinguish planned/allocated/estimated/actual/forecast measures; implement effective-dated rates and budget revisions; document/test progress roll-up before surfacing management KPIs.

**Exit:** totals reconcile from authorized source records and expose data validity/drill-down.

## 6. Alerts and executive decision support

Implement alerts as evaluated rules over authoritative data, with severity, timestamps, ownership and drill-down. Build the manager-prioritized mobile dashboard only on tested services/queries and approved KPI definitions. Add executive issue follow-up and role-aware personal/manager home routes with explicit data scope. Build meeting schedule and gross-revenue reporting only after source, permission and business rules are ratified.

**Exit:** every displayed decision-grade metric is reproducible and scoped; stale/missing data is visible rather than presented as a success-shaped zero.

## 6a. Project schedule visualization

Add an interactive Gantt/timeline above existing project-detail tabs/sections. Use approved phase/work-item/milestone start/end/status data, preserve current overview/structure/resources, and open an authorized detail panel/page when a schedule item is selected. Validate hierarchy, undated item handling, dependency display, mobile horizontal interaction, keyboard operation and equivalent non-chart navigation. Do not manufacture schedule dates from unrelated fields.

## 7. Operational hardening

Validate security, privacy, performance, accessibility, logging/monitoring, audit retention, backups/restores, disaster recovery, upgrade procedures and user acceptance. Remove prototype-only authentication/data paths from the production system.

## Per-slice checklist

`Business rule → Domain model → Persistence/migration → API/auth/data scope → UI → tests → verification → documentation`

Each slice must include invalid input, boundary values, unauthorized access, persistence failure, and history/audit cases where relevant. Avoid building independent frontend/backend phases without an integrated acceptance path.
