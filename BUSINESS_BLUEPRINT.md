# Business Blueprint

This is the conceptual business view for product discovery. It does not prescribe final statuses or company policy; unresolved choices remain in [OPEN_QUESTIONS.md](./OPEN_QUESTIONS.md).

## Main actors

- Executive/management: cross-company decision support, approved budgets and resource choices.
- HR/recruiter: candidate funnel, interviews, employee records, onboarding and lifecycle.
- Project owner/sponsor: business outcome, client/contract context and approvals.
- Project manager: project delivery, WBS, assignments, time review and forecast within delegated scope.
- Team lead: team capacity, skills and delivery support within assigned scope.
- Employee: personal profile, assigned work, availability and time entry.
- Finance/operations (role to validate): budgets, cost rates, financial controls and reporting.
- System administrator: system configuration and account operations; administrative rights do not automatically imply unrestricted business-data access.

## Person and employee journey

Conceptual sequence:

`Source → Candidate → Interviews → Evaluation → Decision → Accepted → Onboarding → Available/Ready for Allocation → Unassigned → Assigned/Active → Offboarding → Inactive`

- A person may be accepted but not yet working on a project; this interval must be representable.
- Candidate recruitment records, interview history, scores, decision, source and documents should remain traceable after hiring.
- `Employee` is the employment/person record. `UserAccount` is an optional, separately governed authentication identity.
- Employee state and project assignment state are distinct: an active employee can be temporarily unassigned or assigned to multiple projects.
- Preserve dated state transitions and reason/actor where policy requires; current state alone cannot explain the past.

## Recruitment

Retain referral/source attribution for funnel analysis. A candidate may have multiple typed interviews (technical, behavioral/human, managerial or other), evaluators, dates, outcomes and useful skill observations. Define lawful retention and access for resumes, notes and evaluation data. Candidate-to-employee conversion must not erase the recruitment record or create ambiguous duplicate identity.

## Project lifecycle and ownership

Projects originate from external intake and may proceed through qualification, contract, planning, active execution, testing/acceptance, delivery/deployment, completion and closure. Internal projects may use an approved exception to client/contract data. Every project needs a stable internal ID separate from its business code, accountable owner, project manager, time/financial envelope, dates, status and traceable revisions.

Exact stages, gates and who can approve them remain subject to validation.

## Resource and delivery model

Employees participate through date-effective project assignments, with allocation level/shape and role defined by policy. A person may split capacity across concurrent projects. Assignment history is the source for project participation; avoid mutable duplicated project arrays on employee records.

Work may be structured as:

`Project → Phase/Work Package → Task → Subtask`

Tasks need clear primary accountability even if multiple collaborators are allowed. Track status, priority, estimate, progress, actual effort, due date, dependencies, DoD and change history. Ensure task status, assignment period and project lifecycle rules do not silently contradict one another.

## Time, cost, and progress concepts

Keep these separate:

- **Estimate:** expected effort for a work item.
- **Allocation:** planned share of employee capacity assigned for a period.
- **Planned:** approved effort/cost baseline.
- **Actual:** valid/approved recorded work and costs.
- **Forecast:** best current estimate of outcome at completion.

Timesheets/TimeEntries are authoritative for actual work, under an approved validation policy. Labor cost may be derived from approved hours × effective hourly cost rate; confirm rates, currencies, approvals and confidentiality. Keep budget revisions and variance visible.

Progress must be explainable. Candidate approaches include work/estimate-weighted roll-up, milestone weighting, explicit manual override with reason, or a governed hybrid. Do not equate average task percent to project progress without an approved definition.

## State, history, audit

1. **Current state:** latest business status for a record.
2. **Business history:** domain events/transitions (e.g. accepted, assigned, budget revised) needed to explain lifecycle.
3. **Technical audit:** actor/time/source and before/after details for security and accountability.

These concepts overlap in evidence but are not interchangeable. Set privacy, retention and access policy for each.

## Management dashboard and alerts

Dashboard is decision support, not a data dump. Provide time-window context and drill-down across people, projects, capacity, resources, time, cost, progress, variance, quality/status, distribution, bottlenecks and alerts. Surface missing, stale, provisional or invalid data honestly.

Alerts are derived signals, not canonical project or employee state. Examples: actual time consumption ahead of progress, deadline breach, shortage/over-allocation, project without active work, stale progress, overrun risk, severe planned-vs-actual variance. Every signal needs a defined rule, scope, time basis, severity, owner, refresh and target record.
