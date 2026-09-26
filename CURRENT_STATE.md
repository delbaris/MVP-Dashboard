# Current State

**Verified against repository:** 2026-09-26
**Stakeholder feedback incorporated:** 2026-09-26; requested dashboard/report enhancements are requirements only, not yet implemented.
**Current product maturity:** UI prototype / concept demonstrator. No production backend or authoritative business data is present.

## Technology and execution

- Private npm project `employee-project-ops-command-center`, version `0.1.0`, ES modules.
- React 18.2, React DOM 18.2, React Router DOM 6.23, Recharts 2.12; Vite 5.2 and React Vite plugin 4.2. Vazirmatn is installed through `@fontsource`.
- Vite build and development scripts exist. No test, lint, type-check, or format script is currently declared in `package.json`.
- The page is Persian/RTL (`index.html`), uses `HashRouter`, and Vite sets the base URL to `/MVP-Dashboard/`.
- `.github/workflows/deploy.yml` builds with Node 20 and deploys `dist` to GitHub Pages on pushes to `main` or manual dispatch.

## Implemented UI areas

- Main dashboard and dashboard widgets for activity, alerts, KPI cards, operational health, project list, recruitment funnel, and workload.
- Employee list/detail, recruitment list/candidate detail, project list/detail, activities, analytics, alerts, concept Copilot, settings, and not-found page.
- Shared layout/navigation and UI elements (modal/drawer/dialog, form fields, badges, avatar, progress, toast, loading, breadcrumbs, and Jalali date picker).
- `ProjectStructure` and project-financial presentation utilities are present. Financial values may come from hard-coded demonstration values.
- Project detail already has overview/structure/resources and related sections; an interactive project Gantt chart above these sections is requested but not present.
- Existing dashboard widgets are not yet organized into the manager-requested mobile-first KPI priority/order and drill-down experience.
- Budget/hour/cost samples and financial summary presentation exist, but there is no authoritative gross-revenue ledger or detailed budget/expense report.
- No team/management meeting schedule or meeting data module is present.
- Persian-number and Jalali helpers are present. Existing date data in fixtures is Jalali-shaped text; it is not a canonical server-side timestamp/date policy.

## State and data behavior

- Seed modules in `src/data/` provide sample employees, candidates, projects, tasks, activities, alerts, and conceptual journey/audit/role data.
- `DataContext` loads seed employees/candidates/projects/tasks and sample recruitment sources, then stores editable demo collections in browser `localStorage` under `robin-demo-data-v1`. Other display-only fixtures are imported directly by consumers.
- The data context performs client-side add/update/delete and reset operations. There is no API, SQL database, cross-user synchronization, transaction boundary, server validation, or data backup/restore.
- `AuthContext` accepts a fixed demonstration account (`admin@robinparham.local`) and a hard-coded password in client code, then persists the demo user in `localStorage` (`mvp-dashboard-auth`). This is not authentication suitable for any real data or deployment.
- `AppContext` supplies UI state including a selectable role and presentation mode. Role selection is a prototype interaction, not a permission policy or enforced data scope.
- Seed project memberships, dates, task status and financial samples are illustrative and may be internally inconsistent or historical. Never use them to infer current company staffing, delivery status, or finance.

## Security and production gaps

- Client route protection and local role selection provide no backend security. There is no API to authorize, validate, audit, or isolate data.
- No SQL Server or other authoritative persistence, migration strategy, backup implementation, observability, server configuration, or production deployment is in this repository.
- Browser storage is not an appropriate store for confidential employee, candidate, commercial, or financial records.
- The GitHub Pages workflow publishes a static prototype and is not the requested internal/on-prem production topology.
- No test suite, CI test job, accessibility audit, or backend exists in the observed project.

## Next recommended engineering step

Use [MANAGEMENT_FEEDBACK_2026-09-26.md](./MANAGEMENT_FEEDBACK_2026-09-26.md) as the product brief for the next UX discussion. Confirm gross-revenue and expense definitions, executive issue triage, meeting ownership/privacy, role-specific home views, and Gantt schedule source before presenting those figures as real. A clearly labeled UI-only prototype can be built with synthetic data after scope is confirmed; do not expand the dashboard as if it were the system of record. For production operations, validate open business decisions and architecture/environment, then establish backend, identity/security, migrations, and a tested employee vertical slice.

## Evidence map

- App entry/providers/routes: `src/main.jsx`, `src/App.jsx`
- Auth and data behavior: `src/context/AuthContext.jsx`, `src/context/DataContext.jsx`
- Demo entities: `src/data/`
- UI surfaces: `src/pages/`, `src/components/`
- Financial demo rules and date helpers: `src/utils/projectFinancials.js`, `src/utils/jalali.js`
- Dependency/scripts: `package.json`
- Static build/deployment: `vite.config.js`, `.github/workflows/deploy.yml`
