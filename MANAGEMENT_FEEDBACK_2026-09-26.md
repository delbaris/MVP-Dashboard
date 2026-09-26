# Management and Technical Lead Feedback

**Captured:** 2026-09-26
**Source:** Feedback relayed by the project owner from technical lead/manager Engineer Shaghaghi.
**Status:** Product direction and requested UX behavior; not yet implemented, and KPI/accounting/permission policies are not fully defined.

## 1. Budget and expense reporting

The existing budget/cost area has provided labor and project reports. The manager asks whether budget reporting and detailed cost breakdowns can be included as well.

**Product direction**

- Provide an overview of approved budgets and costs at an appropriate company/project scope.
- Drill from totals to detail by project and an agreed expense/cost category, with traceable source records.
- Distinguish approved budget/baseline and revisions from commitments, approved actual costs, forecast and remaining budget.
- Protect financial/cost-rate detail by role and scope.
- Do not represent current hard-coded demo financial values as real accounting or expense records.

**Policy to confirm:** what qualifies as a cost line/expense; category taxonomy; treatment of labor, vendors, purchases, tax, currency/exchange rates and commitments; approval and accounting source; reporting period; who can view each detail level.

## 2. Project detail Gantt/timeline

The active-project list and existing project detail are valued. Request: place a Gantt chart near the top of project detail for an at-a-glance schedule. Selecting a segment should reveal its details. Retain the existing lower overview, structure, resources and other sections.

**Product direction**

- Add a schedule overview above, not instead of, existing detail sections.
- Make bars/milestones selectable and drill to the corresponding authorized phase, work item or milestone detail.
- Communicate schedule and status at a glance; do not imply unsupported schedule data.
- Support narrow mobile viewports, readable labels, keyboard/accessibility and an equivalent details path outside the chart.

**Policy to confirm:** schedule hierarchy/data source; which records are bars vs milestones; planned vs actual dates; progress/status encoding; dependencies; treatment of missing dates, overlapping work and date changes; timeline zoom and mobile interaction.

## 3. Executive home — mobile-first information priority

The requested mobile home-page order from top to bottom is:

1. Total budget and total cost.
2. Total gross revenue.
3. Active projects.
4. Issues requiring executive follow-up.
5. Team-member and/or executive meeting schedule.
6. Active employee count.
7. Recruitment and hiring.

Use concise cards/charts with low visual density. Selecting a summary should reveal authorized detail. The list defines requested priority/order, not formulas or permission to invent data. Gross revenue, company-level aggregation, reporting period, and the meaning of executive-attention issues must be ratified first.

## 4. Mobile-first, role-aware experience

- Design for limited phone width and executive usability first; scale up for tablet/desktop without overloading the first screen.
- Let signed-in users reach and view their own profile.
- Managers should have their authorized dashboard/management pages and their own personal profile. Employee and manager views are not mutually exclusive.
- Cards, charts and other summary views should drill down only to detail allowed for the signed-in user.
- Treat UI routing/visibility as experience design, never as access control. Backend permission and record/field data scope remain mandatory for production.

## Acceptance outline for subsequent design/implementation

- At target phone widths, preserve the seven requested KPI groups in the stated order and avoid horizontal overflow of the page; detail/chart subviews may use explicit, accessible horizontal timeline scrolling.
- Every shown summary declares/links to its definition/source/time window and has an authorized drill-down; missing or provisional data is visibly labeled rather than displayed as a real zero.
- Project detail retains current sections and places Gantt before them; selecting a Gantt item opens the matching item detail.
- A signed-in employee can reach their own profile; manager-specific overview and employee self-profile coexist without trusting a client-side role toggle.
- Budget/cost details reconcile to approved underlying records and apply role/data scope before production use.

## Related project memory

See [PROJECT_REQUIREMENTS.md](./PROJECT_REQUIREMENTS.md) for requirement IDs, [OPEN_QUESTIONS.md](./OPEN_QUESTIONS.md) for decisions required before operational implementation, [BUSINESS_BLUEPRINT.md](./BUSINESS_BLUEPRINT.md) for the dashboard/business model, and [CURRENT_STATE.md](./CURRENT_STATE.md) for features not yet implemented.
