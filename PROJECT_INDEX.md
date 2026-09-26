# Project Index

> Durable entry point for contributors and AI agents. Read this file first, then follow the links that match the task. Keep it aligned with the repository; do not infer implementation status from a blueprint.

## Project at a glance

This repository currently contains a Persian, right-to-left React/Vite single-page **prototype** for an internal employee, recruitment, project, and resource operations dashboard. It is not yet the secure, persistent, multi-user operational system described by the target product context.

- **Current implementation:** React 18 + Vite 5 SPA, React Router hash routing, mock/seed data, browser `localStorage`, demonstration-only login and role selector.
- **Target direction (not yet implemented or finally ratified):** modular monolith, ASP.NET Core 10 API, SQL Server, a lightweight SPA served by one internal/on-premise application.
- **Primary working language/UI:** Persian (RTL), with English technical/domain identifiers in code and documentation.
- **Build:** `npm ci` then `npm run build`; local development: `npm run dev`.
- **Baseline date supplied for product context:** 2026-09-21. Repository snapshot reviewed for these documents: 2026-09-26.

## Read the project memory in this order

1. [PROJECT_CONTEXT.md](./PROJECT_CONTEXT.md) — product purpose, organization context, principles, and boundaries.
2. [CURRENT_STATE.md](./CURRENT_STATE.md) — verified repository and prototype status; current limitations.
3. [MANAGEMENT_FEEDBACK_2026-09-26.md](./MANAGEMENT_FEEDBACK_2026-09-26.md) — captured manager/technical-lead feedback and resulting experience direction.
4. [PROJECT_REQUIREMENTS.md](./PROJECT_REQUIREMENTS.md) — Phase 1 functional and non-functional requirements.
5. [OPEN_QUESTIONS.md](./OPEN_QUESTIONS.md) — unresolved business and technical decisions; do not silently invent answers.
6. [DECISIONS.md](./DECISIONS.md) — decisions, recommendations, and decision status.
7. [PRE_IMPLEMENTATION_BLUEPRINT.md](./PRE_IMPLEMENTATION_BLUEPRINT.md) — staged delivery and vertical-slice plan.
8. [BUSINESS_BLUEPRINT.md](./BUSINESS_BLUEPRINT.md) — business lifecycle and operating concepts.
9. [DATA_MODEL_BLUEPRINT.md](./DATA_MODEL_BLUEPRINT.md) — conceptual relational model and source-of-truth rules.
10. [ARCHITECTURE_DECISION.md](./ARCHITECTURE_DECISION.md) — target architecture options and current recommendation.
11. [AI_DEVELOPMENT_CONTRACT.md](./AI_DEVELOPMENT_CONTRACT.md) — instructions for AI-assisted changes.
12. [DOCUMENTATION_GOVERNANCE.md](./DOCUMENTATION_GOVERNANCE.md) — how project memory is changed and maintained.

## Repository map

| Path | Responsibility | Current caveat |
|---|---|---|
| `src/main.jsx` | React entry, global font/CSS imports, `HashRouter` | Client-only application |
| `src/App.jsx` | Providers and route registration/guard | Login guard is client-side only |
| `src/pages/` | Dashboard, employees, recruitment, project, analytics, alerts, settings, and related screens | Many screens display seeded/demo data |
| `src/components/layout/` | App shell, navigation, search, top bar | Navigation visibility is not authorization |
| `src/components/dashboard/` | Dashboard widgets | Displayed metrics are not authoritative business KPIs |
| `src/components/project/` | Project structure view | Prototype presentation; not a persisted WBS model |
| `src/components/ui/` | Shared UI controls, dialogs, notifications, Jalali picker | Validate accessibility and date behavior before production use |
| `src/context/` | `AppContext`, `AuthContext`, `DataContext` | In-memory React state and `localStorage`; no server boundary |
| `src/data/` | Seed records for employees, candidates, projects, tasks, journey, alerts, and activities | Demo fixtures, not company records or a database schema |
| `src/utils/` | Status labels, Jalali formatting/conversion, demo financial calculations | Demo rules must not be treated as approved policy |
| `src/styles/index.css` | Global RTL and application styles | Single stylesheet |
| `public/` | Locally served image and favicon | No runtime CDN required for listed assets |
| `.github/workflows/deploy.yml` | GitHub Pages build/deploy on pushes to `main` | Pages deployment is not the intended internal production deployment |
| `vite.config.js` | Vite/React configuration and `/MVP-Dashboard/` base path | Revisit base path if hosting changes |

## Change protocol

- Start with `CURRENT_STATE.md` and the relevant requirements/blueprints.
- Treat user-confirmed business policies as authoritative; log consequential choices in `DECISIONS.md` and remove resolved items from `OPEN_QUESTIONS.md`.
- After implementation, update `CURRENT_STATE.md`, relevant requirements/blueprints, and this index when the repository map or entry points change.
- Never report a planned capability as implemented. Never use demo values as real operational facts.
- Keep project documentation tracked by Git. Do not add a blanket `*.md` ignore rule.
