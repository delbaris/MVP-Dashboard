# Open Questions

These questions block or shape production decisions. Do not silently choose a business policy in code. Record owner, decision, and date in [DECISIONS.md](./DECISIONS.md) when resolved; then update requirements and relevant blueprints.

## Organization and lifecycle

1. Who is the business owner for employee, recruitment, project, time, and finance policies?
2. What are the canonical organization units, job titles, employment types, offices, countries, currencies, and legal entities? Are Tehran/Dubai and the stated staffing numbers still accurate?
3. What exact candidate and employee lifecycle statuses/transitions are valid, including offer declined, withdrawn, rejected, accepted-but-not-started, onboarding, available, leave, and offboarding?
4. When and how does a hired candidate become an employee, and how is interview/recruitment history preserved without duplicating identity data?
5. What employee fields are required, sensitive, editable, and visible to each role? What is the authoritative personnel-code issuer?
6. How are managers, teams, dotted-line reporting and temporary assignments represented?

## Security and operations

7. What identity source is available (local accounts, directory/SSO, or another internal provider)? Who provisions/deactivates accounts; is MFA required?
8. Which roles and permissions exist, and what row-level data scopes apply to HR, executives, project managers, team leads, finance, and employees?
9. Which on-prem environment, operating system, network constraints, backup target, recovery-point/recovery-time objectives, and restore test cadence are required?
10. Which records/documents are legally or contractually sensitive, where may they be stored, and what are retention, export, audit, and deletion requirements?
11. What are expected user/data volumes, availability requirements, supported browsers/devices, localization, and accessibility baseline?

## Project, work, and time

12. What project intake, contract approval, planning, delivery, acceptance, closure, cancellation and archival states/transitions are required?
13. Are WBS nodes limited to phase/work package/task/subtask? Can a task belong to one project only? What dependency types, assignment rules, primary accountability, DoD and change history are needed?
14. Is allocation a percentage, hours per period, or both? Can assignments overlap? What capacity baseline, non-project allocation, holidays, leave, part-time schedules and overload thresholds apply?
15. What time-entry granularity, timesheet period, submission/approval/rejection/correction policy, billable flag, rounding, overtime, and locking rules apply?
16. What is the authoritative timezone policy for Tehran, Dubai, traveling staff, date-only milestones, and timestamped audit events? Which value is stored and which is displayed in Jalali?
17. Which calendar implementation and tested Jalali/Gregorian conversion rules are acceptable for backend and browser, including leap-year boundaries and DST/time-zone behavior?

## Financials, progress, dashboard, and alerts

18. Which currencies and exchange-rate source/date are required? Are budgets tax-inclusive? What are financial period and rounding rules?
19. Are employee hourly cost rates confidential? Who can view/change them? Are rates effective-dated by employee, office, role, or project?
20. What constitutes planned cost, actual cost, remaining budget, forecast and variance? Is labor cost approved hours multiplied by effective cost rate, or is another policy authoritative?
21. Which project-progress method is approved: weighted task estimates, earned value, milestone weighting, explicit manual update, or a documented hybrid? Who may override it, and with what reason?
22. For each KPI, alert and health score, what are exact definition, formula, source, time window, aggregation, refresh, quality/validity handling, severity, owner, and drill-down?
23. What constitutes "no progress", over-allocation, capacity shortage, severe variance, deadline breach, and financial overrun risk? What notification channels and escalation rules are wanted?

## Architecture and delivery

24. Confirm .NET 10 availability/support in the target environment and whether SQL Server is operationally/licensing-approved.
25. Which frontend framework/tooling should replace or evolve the current React/Vite prototype? Should GitHub Pages deployment be retained for non-production preview only?
26. What API authentication/session design, CSRF/CORS policy, secret management, logging/monitoring, and audit retention are required?
27. What are the first usable vertical slice and measurable acceptance criteria? Which import/migration sources exist, if any?
