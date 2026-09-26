# Documentation Governance

Repository documentation is the durable memory of the project. It must allow a new person or AI agent to understand intent, actual implementation, unresolved policy and next steps without relying on chat history.

## Source of truth

1. **Actual code/config/tests** prove current implementation behavior.
2. **Owner-confirmed decisions** in `DECISIONS.md` govern approved policy and architecture.
3. **Requirements and blueprints** describe intended behavior, not implementation status.
4. **`CURRENT_STATE.md`** is a verified snapshot, not a roadmap or aspirational claim.
5. **`OPEN_QUESTIONS.md`** records unresolved choices. Do not turn its suggestions into silently accepted policy.
6. **`PROJECT_INDEX.md`** is the navigation entry point and reading guide.

If documents conflict, do not guess. Verify implementation and decision status; correct the stale document and, for consequential business ambiguity, consult the owner.

## File responsibilities

- `PROJECT_INDEX.md`: summary, reading order, repository map and change protocol.
- `PROJECT_CONTEXT.md`: mission, organization assumptions, principles, phases and target direction.
- `CURRENT_STATE.md`: dated facts verified in code/config/tests and known gaps.
- `MANAGEMENT_FEEDBACK_YYYY-MM-DD.md`: dated stakeholder feedback, preserved as received in substance and translated into UX direction, acceptance outline and linked open decisions.
- `DECISIONS.md`: accepted principles, dated decision records, proposals and rationale.
- `OPEN_QUESTIONS.md`: unresolved business/technical choices and owners needed.
- `PROJECT_REQUIREMENTS.md`: testable capability and quality requirements.
- `PRE_IMPLEMENTATION_BLUEPRINT.md`: delivery order, gates and slice checklist.
- `BUSINESS_BLUEPRINT.md`: business actors, lifecycle and conceptual operations.
- `DATA_MODEL_BLUEPRINT.md`: conceptual entities, relationships, source-of-truth, privacy and derivations.
- `ARCHITECTURE_DECISION.md`: architecture status, context, alternatives and consequences.
- `AI_DEVELOPMENT_CONTRACT.md`: working instructions for agents/contributors.
- Module-specific documents: add when a module starts; cover its scope, state transitions, authorization, data ownership, interfaces, test strategy and operational concerns.

## Update triggers

| Change | Documents to review/update |
|---|---|
| New/changed/removed capability | `PROJECT_REQUIREMENTS.md`, module docs, `CURRENT_STATE.md`, `PROJECT_INDEX.md` if map changes |
| Business policy/status/KPI/cost/time decision | `DECISIONS.md`, `OPEN_QUESTIONS.md`, requirements, business/data blueprint |
| New stakeholder feedback | Add a dated feedback record; update `PROJECT_INDEX.md`, requirements and relevant blueprint/current state; record unresolved policy in `OPEN_QUESTIONS.md` |
| Architecture/hosting/security boundary | `DECISIONS.md`, `ARCHITECTURE_DECISION.md`, `CURRENT_STATE.md`, requirements |
| Entity, relationship, source-of-truth, retention change | `DATA_MODEL_BLUEPRINT.md`, related requirements/module docs, decision log |
| New module starts | Add focused module documentation; update index and implementation state |
| Prototype/demo changes | Update `CURRENT_STATE.md`; label demo behavior and avoid claiming production readiness |
| Major completed slice/release | Refresh current state and next steps; close resolved questions; preserve dated decision history |

## Maintenance rules

- Date repository-state reviews in ISO format (`YYYY-MM-DD`) and state what was inspected.
- Keep concise, link related docs with relative paths, and define unfamiliar acronyms on first use.
- Use explicit labels: **Implemented**, **Confirmed**, **Proposed**, **Open**, and **Out of scope**.
- Never duplicate long policy text in multiple documents; link to its canonical home and summarize only as needed.
- Keep decisions append-only where practical: supersede old entries with a new dated decision and rationale rather than erasing historical context.
- Remove/close resolved open questions only when the decision is recorded and downstream docs are updated.
- Treat organization numbers, sample records, names, dates, and UI calculations as assumptions/demo data unless separately validated.
- Keep docs in Git: project memory is useful to every checkout and contributor. The root `.gitignore` must not ignore all Markdown.
- Before finishing a change, check links, file names, current-vs-target claims, and whether the change created stale instructions.

## Minimum handoff for a substantial change

State what changed, which behavior is implemented versus proposed, checks run and their outcomes, policy still open, and the next safe action. A chat summary alone does not replace updating repository memory.
