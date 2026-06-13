# Project Instructions for Codex

Scope: this file applies only to this repository: Internal Asset Equipment Management System.

## Mandatory Reading

Before making code changes, read:

1. `docs/ai/README.md`
2. `docs/ai/engineering-standards.md`

Then open only the task-specific documents needed for the change:

- Backend work: `docs/ai/backend-implementation-notes.md`, `docs/ai/backend-class-map.md`, `docs/ai/api-map.md`
- Frontend work: `docs/ai/frontend-implementation-notes.md`, `docs/ai/frontend-map.md`, `docs/ai/frontend-development-guide.md`
- Cross-layer/API work: `docs/ai/api-map.md`, `docs/ai/business-flows.md`, `docs/ai/symbol-index.md`
- Config/deployment work: `docs/ai/deployment-config-notes.md`
- Architecture decisions: `docs/ai/decision-log.md`
- Known risks and next work: `docs/ai/maintenance-notes.md`

## Senior Engineering Rules

- Verify assumptions in code before editing. Do not invent endpoints, DTO fields, enum values, services, environment keys, or package behavior.
- Follow existing architecture and naming. Avoid parallel patterns unless the current pattern is demonstrably wrong for the task.
- Keep changes scoped. Do not mix unrelated refactors, formatting churn, generated-file edits, or package-lock changes into feature/bug work.
- Preserve authorization, validation, audit logging, soft-delete, restore, and retention-cleanup behavior unless the task explicitly changes them.
- Do not hide mismatches behind `any`, broad `try/catch`, optional chaining everywhere, or placeholder logic.
- Prefer explicit, maintainable code over clever abstractions. Add abstractions only when they remove real complexity or match an established local pattern.
- Update docs in `docs/ai` when routes, contracts, workflows, architecture, config, or known risks change.

## Backend Rules

- Keep controllers thin; business rules belong in `AssetManagement.Application/Services`.
- Use DTOs as API contracts; do not expose domain entities directly.
- Add or update FluentValidation validators for request-boundary rules.
- Keep EF Core and persistence details in infrastructure repositories.
- Before changing an entity field, inspect entity, DTOs, validators, AutoMapper profile, EF configuration/migrations, Angular models, forms, and docs.
- Before changing delete behavior, inspect soft-delete query filters, repository delete/restore methods, cleanup service, audit behavior, and frontend reloads.

## Frontend Rules

- Do not call HTTP directly from feature components when a domain service exists or should exist.
- Keep singleton API/auth/storage logic in `core`, reusable UI in `shared`, and routed business screens in `features`.
- Keep TypeScript models and enum values aligned with backend DTOs and enums.
- Reuse existing shared components where appropriate, especially loading, page header, data table, and confirm dialog.
- Before changing list filters, check whether the filter is server-side, client-side on the current page, or both.

## Verification

Run verification that matches the risk:

- Docs-only changes: targeted text search for links/paths/stale references.
- Frontend changes: `npm test` and `npm run build` from `Frontend` when feasible.
- Backend changes: `dotnet build` and `dotnet test` from `Backend` when feasible.
- Cross-layer changes: verify both backend and frontend.

If verification is skipped, state the exact command that was not run and why.
