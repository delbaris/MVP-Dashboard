# AI Development Contract

Instructions for AI agents and contributors working in this repository. These project rules complement higher-priority platform/repository instructions; they do not supersede them.

## Before changing code

1. Read [PROJECT_INDEX.md](./PROJECT_INDEX.md), [CURRENT_STATE.md](./CURRENT_STATE.md), and the relevant requirements/blueprints.
2. Inspect the actual code and working-tree changes. Documents are context, not proof that code already exists.
3. Separate verified behavior, proposed design, confirmed decisions and unresolved policy. Check [OPEN_QUESTIONS.md](./OPEN_QUESTIONS.md) before encoding business behavior.
4. Trace related routes, data flows, authorization surfaces, tests, and documentation; reuse existing patterns when sound.
5. For ambiguous business/security behavior with multiple reasonable outcomes, ask the product owner; do not fabricate rules or sample operational data.

## Engineering standards

- Deliver precise, complete, surgical changes; do not mix unrelated cleanup.
- Keep modules cohesive and focused. Avoid God objects, oversized services/controllers/components, speculative abstractions and unnecessary runtime dependencies.
- Preserve normalized relational source-of-truth concepts. Do not encode core relationships in mutable duplicates, unvalidated JSON, UI state or dashboard calculations.
- Treat `Employee` and `UserAccount` separately. Use internal IDs distinct from business codes.
- Never assume UI hiding is security. Enforce operation authorization and record/field data scope on the server, default deny, and test unauthorized paths.
- Keep actual time tied to valid/approved time entries; distinguish estimates, allocation, plans, actuals and forecasts.
- Do not invent KPI formulas, progress averaging, budget/cost policy, lifecycle status, capacity threshold or timezone behavior. Resolve or make provisional semantics explicit.
- Surface meaningful errors; do not mask errors with broad catches, silent fallbacks or success-shaped defaults.
- Prefer proper types/guards and repository-supported tools; avoid unsafe casts.
- Keep UI responsive, accessible, Persian RTL where relevant, and use local assets. Validate Jalali/Gregorian boundaries and canonical date/time semantics.
- Do not add credentials, real personnel data, customer secrets or confidential operational data to source/docs/fixtures.

## Verification and delivery

- Run the smallest relevant existing tests/build/type-check/lint command; report exactly what was and was not verified. Do not claim tests that do not exist.
- Add focused tests for business calculations, authorization/data scope, validation, date/time, persistence and failure paths as applicable.
- Inspect generated and staged changes; preserve unrelated user work. Never rewrite or delete user changes without explicit approval.
- Keep docs aligned: update `CURRENT_STATE.md` for implementation changes, `DECISIONS.md`/`OPEN_QUESTIONS.md` for policy decisions, relevant requirements/blueprints for changed scope, and `PROJECT_INDEX.md` for navigation/map changes.
- Mark planned capabilities as planned. Never describe demo state, seed records, hard-coded financials or the browser login as production behavior.
- Project Markdown documents are intentional, tracked repository assets. Do not blanket-ignore `.md` files.
