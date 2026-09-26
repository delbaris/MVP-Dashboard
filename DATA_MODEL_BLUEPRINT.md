# Data Model Blueprint

Conceptual relational model only; no database schema or ORM is present in the current repository. Confirm vocabulary, cardinality, retention, and policy with stakeholders before migrations.

## Modeling rules

- Use internal primary keys (`EmployeeId`) independently of unique business codes (`EmployeeCode`).
- Normalize entities and relationships; enforce foreign keys, unique constraints and domain invariants in the database and application.
- Avoid duplicated mutable facts, a generic universal entity table, dashboard-sourced data, and JSON blobs replacing relational core.
- Store canonical instants in UTC (or another explicitly agreed offset-aware representation) and retain/display relevant business timezone; model date-only facts separately from instants.
- Store money as decimal amount with explicit currency and defined rounding; never use floating-point arithmetic for authoritative finance.
- Use effective dates for assignments, rates and other changing facts. Prefer append-only/revision records for baselines and decisions whose past values matter.
- Derived values must state their source, policy/version, and recomputation behavior. Do not store derived values without a deliberate cache/reconciliation strategy.

## Proposed conceptual entities

### Organization and identity

- `OrganizationUnit` (hierarchy if required), `Office` (country/timezone), `Position`, `Skill`, `EmployeeSkill`.
- `Employee`: `EmployeeId`, unique `EmployeeCode`, name, contact references, office/unit/position, employment type and dates, lifecycle status, manager relationship, document references, capacity policy and privacy classification.
- `UserAccount`: identity-provider subject, sign-in/status metadata; optionally links to one Employee. Account credentials/secrets belong to the approved identity mechanism, not an employee row.
- `Role`, `Permission`, `RolePermission`, and scoped `UserRoleAssignment`/policy mapping. Represent allowed data scope explicitly; exact schema depends on authorization decisions.
- `EmployeeLifecycleEvent` (or equivalent domain history) for dated business transitions.

### Recruitment

- `Candidate`: candidate identity/contact details, applied position, owner, source, current stage and privacy/retention status.
- `RecruitmentSource`; `CandidateApplication` if multiple applications per person must be represented.
- `Interview`: candidate/application FK, type, scheduled/actual date, interviewer, outcome and structured evaluation.
- `CandidateSkill`/evaluation; `Offer` and `HiringDecision` if their approval and negotiation history need first-class handling.
- Hiring conversion links recruitment/application to Employee without deleting the candidate's history. Avoid duplicating sensitive data without retention reason.

### Project and delivery

- `Project`: internal `ProjectId`, unique `ProjectCode`, name, client/contract reference, owner, manager, start/end, status, description.
- `ProjectStatusHistory`, `ProjectBudgetRevision` and explicit client/contract entities if operational needs justify them.
- `WorkItem`: project FK, optional parent WorkItem FK, type (phase/package/task/subtask), title, owner/responsible person, status, priority, estimate, progress rule/value, due dates and DoD. Use constraints to prevent invalid hierarchy/cycles.
- `TaskAssignment` where tasks support multiple assignees, with an explicit primary-accountability rule.
- `WorkItemDependency`: predecessor/successor and validated dependency type; prohibit cycles if required.
- `ProjectAssignment`: Employee FK + Project FK, effective start/end, allocation value/unit, role, status and change history. This is the source for employee-project participation over time.
- Milestone, Risk and Acceptance records may be first-class where approvals, ownership, and history matter; do not hide critical relationships in unvalidated nested arrays.

### Time, cost and audit

- `Timesheet` (employee + period + status/submission/approval metadata) and `TimeEntry` (employee, project, optional work item, date/interval or duration, activity, billable classification, status).
- `TimeEntryApproval`/revision records as needed for who approved, rejection, corrections, locking and history.
- `EmployeeCostRate` effective-dated, currency-denominated and access-controlled; scope (employee/office/role) to be decided.
- Budget baseline/revision and forecast records tied to project and financial period; preserve who approved each revision.
- `AuditEvent`: actor, timestamp, source/correlation, action, target, permitted before/after representation, reason, and integrity/retention metadata. Avoid logging secrets or unnecessary sensitive values.

## Relationship sketch

```text
UserAccount 0..1 ── 0..1 Employee
Employee 1 ── * EmployeeSkill * ── 1 Skill
Candidate 1 ── * Interview
Candidate/Application 0..1 ── 1 Employee (hiring conversion; history retained)
Employee * ── * Project through ProjectAssignment (effective-dated)
Project 1 ── * WorkItem (WorkItem may have one parent)
WorkItem * ── * Employee through TaskAssignment (if multi-assignee is approved)
WorkItem * ── * WorkItem through WorkItemDependency
Employee 1 ── * Timesheet 1 ── * TimeEntry
TimeEntry * ── 1 Project; TimeEntry 0..1 ── 1 WorkItem
Project 1 ── * BudgetRevision / Forecast; Employee 1 ── * effective CostRate
Any protected record 1 ── * AuditEvent (logical target; enforce privacy/retention)
```

## Source-of-truth and derived measures

| Measure/fact | Authoritative source | Important caveat |
|---|---|---|
| Current employee-project participation | Active effective-dated `ProjectAssignment` | Define what assignment statuses count |
| Actual project/task hours | Valid/approved `TimeEntry` | Corrections, rejected/locked periods and aggregation window must be explicit |
| Remaining hours | Approved baseline less qualifying actuals or approved forecast rule | Do not conflate with remaining employee capacity |
| Actual labor cost | Approved hours × applicable effective rate, if policy approves | Currency, rate scope, exchange rate and rate privacy required |
| Budget variance/forecast | Approved baseline/revisions + actuals + forecast rule | Preserve revision history; do not silently rewrite baseline |
| Project progress | Approved, versioned roll-up/manual rule over work items/milestones | No unweighted task average by default |
| Employee capacity | Working schedule minus approved leave/non-project commitments as defined | Allocation windows and timezone/calendar required |
| Alerts | Derived query/rule over authoritative records | Signal includes rule/version/time and drills down; never becomes source state |

## Deletion, privacy, and integrity

Soft deletion is not a universal default. Define lifecycle/archive semantics per entity. Restrict physical deletion of records with financial, employment, recruitment, assignment or audit history. Use retention/anonymization rules where personal-data obligations require it; do not silently cascade away accountable history. Authorization must consider both entity/action and row/field scope.
