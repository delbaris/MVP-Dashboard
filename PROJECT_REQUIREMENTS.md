# Project Requirements

Requirements below capture the supplied product baseline. They describe the intended Phase 1 system, not the current prototype. Resolve policy-dependent terms through [OPEN_QUESTIONS.md](./OPEN_QUESTIONS.md); write acceptance criteria before implementation.

## Phase 1 scope

### Identity, access, and audit

- **REQ-IAM-01:** Model `Employee` independently from `UserAccount`; permit people without accounts and accounts without incorrectly duplicating employee identity.
- **REQ-IAM-02:** Authenticate users using an internally approved provider and enforce server-side authorization on every protected operation.
- **REQ-IAM-03:** Evaluate both permission (action) and data scope (records/fields/organizational/project boundary). Hiding a UI control must never be the authorization mechanism.
- **REQ-IAM-04:** Record security-relevant and important business changes with actor, timestamp, source, reason, and before/after values as appropriate.
- **REQ-IAM-05:** Preserve business lifecycle history separately from technical audit events.

### Employee and recruitment

- **REQ-HR-01:** Support employee personnel code, identity/account link, contact information, office/country, organizational unit, position, employment type, employment dates, status, skills/levels, document reference, weekly capacity, effective hourly cost/rate where authorized, and manager.
- **REQ-HR-02:** Support historically traceable lifecycle stages from candidate/source through interviews/evaluation/decision, accepted, onboarding, available/unassigned, assigned/active and offboarding/inactive.
- **REQ-HR-03:** Capture recruitment source and retain recruitment history if a candidate is hired.
- **REQ-HR-04:** Support multiple typed interviews per candidate and useful skill/evaluation records.
- **REQ-HR-05:** Do not store a manually maintained employee project-history field; derive participation from dated project assignments.

### Projects and resource allocation

- **REQ-PROJ-01:** Treat Project as a first-class entity with internal ID and distinct project code, name, client, contract reference, owner, project manager, dates, status, progress, time/financial budget, description, and appropriate history.
- **REQ-PROJ-02:** Support lifecycle traceability from external intake through planning, execution, testing/acceptance, delivery/deployment, completion and closure, as applicable.
- **REQ-ALLOC-01:** Model employee-to-project participation as many-to-many through a first-class, date-effective, allocation-aware `ProjectAssignment`.
- **REQ-ALLOC-02:** Make assignment start/end and allocation visible; validate date and capacity constraints according to approved company policy.

### Work, time, and financial control

- **REQ-WORK-01:** Support project work hierarchy (phase/work package/task/subtask as approved), assignee(s), primary accountability, status, priority, estimate, actual, progress, deadline, dependencies, history and Definition of Done.
- **REQ-TIME-01:** Use `TimeEntry`/timesheet as the authoritative actual-work record. Clearly distinguish estimate, allocation, planned, actual and forecast.
- **REQ-TIME-02:** Derive reported actual project time from valid/approved entries according to a documented, tested policy.
- **REQ-FIN-01:** Support planned hours, actual hours, remaining hours, planned/actual cost, remaining budget, variance, forecast and budget revision history.
- **REQ-FIN-02:** If labor cost is derived from hours × cost rate, use approved hours and the correct effective-dated rate; protect rate data by permission and scope.
- **REQ-FIN-03:** Provide budget and cost reporting with a drill-down from project/company summaries to authorized, categorized underlying cost entries and budget revisions. Clearly distinguish budget, committed cost, approved actual cost, forecast and remaining budget; never imply the current demo estimates are ledger data.
- **REQ-FIN-04:** Support a gross-revenue overview only after its business definition, period, source records, currency/tax treatment and access policy are approved. Revenue must remain distinguishable from budget, contract value, invoiced revenue and recognized revenue.
- **REQ-PROG-01:** Do not treat an unweighted average of task percentages as project progress without explicit, documented validation. Any roll-up or override must be explainable and auditable.

### Management information and operations

- **REQ-DASH-01:** Provide decision-support views for people, projects, capacity, resources, time, cost/finance, progress, variance, quality/status, distribution, bottlenecks and alerts.
- **REQ-DASH-02:** Use a mobile-first, low-density executive home view. In the requested priority order, surface: total budget and total cost; total gross revenue; active projects; issues requiring executive follow-up; team/management meeting schedule; active employee count; recruitment. Present concise cards/charts and allow authorized drill-down to details.
- **REQ-DASH-03:** Provide role-aware home experiences: employees can reach their own profile and relevant work; managers see an authorized management dashboard and their own profile. A client-side role switch is not an identity or authorization solution.
- **REQ-DASH-04:** Adapt chart/card density and navigation to narrow mobile widths first, then expand progressively for larger viewports; maintain readable Persian RTL layout and accessible drill-down controls.
- **REQ-DASH-05:** Provide an executive follow-up view backed by actionable, scoped issues/alerts with accountable owner, severity, status and drill-down; agree which signals qualify before presenting an aggregate count.
- **REQ-DASH-06:** Provide a schedule surface for relevant team/management meetings with clear ownership, time zone, visibility and detail navigation, subject to scheduling/privacy policy and an approved data source.
- **REQ-DASH-07:** Preserve existing project detail overview, structure, resources and related sections, and add a project Gantt/timeline above them. Gantt items must be selectable to open the corresponding authorized phase/work item/milestone details; do not replace existing sections.
- **REQ-DASH-08:** Gantt must communicate schedule dates, duration, hierarchy and status at a glance, work on mobile (for example, horizontal timeline interaction without hiding labels/actions), and expose an accessible non-chart route to the same details. Define its source of dates/status and behavior for undated items before production use.
- **REQ-KPI-01:** Define every material KPI by formula, source, time window, aggregation, refresh policy, data-validity status and drill-down target before treating it as decision-grade.
- **REQ-ALERT-01:** Support derived signals for time consumption vs progress, deadline breach, capacity shortage, over-allocation, projects without active tasks, stale progress, financial overrun risk and severe planned-vs-actual variance.
- **REQ-ALERT-02:** Show source, rule/threshold, detection time, severity and affected record for every alert; alerts are not authoritative business data.
- **REQ-OPS-01:** Provide tested backup and restore for authoritative data and required documents, with operational ownership defined.
- **REQ-OPS-02:** Support local/internal/on-prem deployment for Phase 1, subject to confirmed environment.

## Cross-cutting quality requirements

- Relational integrity and normalized entities; no dashboard as source of truth, universal entity blob, or JSON replacing core relationships.
- Secure defaults, least privilege, server-side validation, explicit errors, auditable privileged operations, and protection of employee/recruitment/financial data.
- Responsive, mobile-first, Persian RTL interface with executive home KPI priority reflecting manager feedback; locally hosted assets preferred; correct Persian/Jalali display with a canonical timezone-aware storage policy.
- Maintainable modular monolith boundaries, small focused components/services, explicit ownership of derived values, and low unnecessary runtime dependency count.
- Automated tests for domain rules, authorization/data scope, calculations, date/time handling, migrations, API behavior, and UI behavior as they are introduced.
- Documentation must distinguish current implementation, confirmed policy, proposed design, and unresolved questions.

## Out of scope for initial operational core

AI assistant/agents, RAG, model integrations, smart workflows, advanced anomaly detection and recommendations are future optional layers. They must not be prerequisites for employee/project/time operations or trusted reporting. Third-party integrations are conceptual until separately prioritized and secured.

## Acceptance gate for a production feature

Before calling a slice done, document its business rule and role/scope matrix; implement persistence and server enforcement; validate input and relationships; preserve audit/history where relevant; test normal, boundary, unauthorized, invalid and failure paths; expose meaningful UI states; and update current state, decisions/questions and relevant blueprints.
