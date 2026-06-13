# Engineering Standards

Purpose: prevent low-quality AI-generated changes and keep this repository at a senior enterprise standard. These rules are mandatory for human and AI-assisted work.

## Core Standard

Act like a senior engineer responsible for production behavior, not like a code generator trying to satisfy a prompt quickly.

Every change must be:

- grounded in the existing codebase, architecture, and naming conventions
- small enough to review, unless the requested change explicitly requires a larger migration
- correct across backend, frontend, database, validation, authorization, and documentation contracts
- covered by an appropriate verification step or a clear explanation of why verification was not possible

Do not ship code that merely "looks plausible". Verify assumptions in the source.

## Anti-AI-Slop Rules

Avoid these failure modes:

- inventing APIs, DTO fields, routes, services, environment keys, or package behavior without checking the code
- adding generic abstractions because they sound enterprise-grade
- duplicating logic instead of finding the existing service, helper, validator, pipe, or shared component
- changing generated files, migrations, package locks, or broad formatting without a concrete reason
- hiding a contract mismatch behind `any`, optional chaining everywhere, or broad try/catch blocks
- adding comments that narrate obvious code instead of clarifying real decisions
- ignoring compile errors, lint errors, test failures, or type errors because the requested feature "seems done"
- mixing unrelated cleanup/refactors into a feature or bug fix
- weakening authorization, validation, or audit behavior to make UI/API integration easier

If a request is ambiguous, inspect the code first. Ask only when the decision changes behavior, security, data shape, or user workflow and cannot be inferred safely.

## Enterprise Design Expectations

Backend changes must preserve the layered architecture:

- `Domain` owns entities and enums.
- `Application` owns DTOs, validators, service interfaces, repository interfaces, mappings, and business use cases.
- `Infrastructure` owns EF Core, repositories, migrations, security implementations, and persistence.
- `API` owns controllers, middleware, filters, hosted services, and composition.

Frontend changes must preserve the Angular structure:

- `core` owns singleton services, guards, interceptors, and API contracts.
- `shared` owns reusable UI components, directives, and pipes.
- `features` own routed business screens and workflow state.

A change that crosses layers must update every affected layer deliberately. For example, an asset field change usually touches entity, DTOs, mapping, EF configuration/migration, validators, Angular models, forms, detail/list views, and docs.

## Backend Coding Rules

- Keep controllers thin. Put business decisions in application services.
- Keep services explicit about business rules and failure reasons.
- Use validators for input rules that belong at request boundary.
- Use repositories for persistence queries; do not leak EF details into controllers.
- Keep DTOs as API contracts. Do not expose domain entities directly.
- Preserve soft-delete, restore, retention cleanup, and audit behavior when changing delete flows.
- Keep authorization attributes and frontend guards aligned, with backend authorization as the source of truth.
- Do not introduce global exception swallowing. Failures should be visible and diagnosable.

## Frontend Coding Rules

- Do not call HTTP directly from feature components when a domain service exists or should exist.
- Keep route protection in guards and visibility in directives/components; do not confuse hidden UI with real authorization.
- Keep TypeScript models aligned with backend DTOs and enums.
- Prefer existing shared components before creating new UI primitives.
- Use typed forms and explicit loading/error states for user workflows.
- Keep feature styling local unless the rule is genuinely reusable across features.
- Do not use `any` for domain data unless the surrounding shared component contract already requires it.

## Contract Discipline

Before changing any API contract:

1. Find the backend controller action and service method.
2. Find the DTO, validator, mapping profile, and entity or enum.
3. Find the Angular service and model.
4. Find all list/form/detail components using the contract.
5. Update `api-map.md`, `frontend-map.md`, or `symbol-index.md` if the public shape changes.

Backend enum numeric values and frontend enum numeric values must remain synchronized.

## Testing and Verification

Verification should match risk:

- Documentation-only change: check links/paths and run targeted text search.
- Frontend UI/service/model change: run `npm test` and `npm run build` from `../../Frontend` when feasible.
- Backend service/controller/domain change: run `dotnet test` when tests exist; otherwise run at least `dotnet build` from `../../Backend`.
- Cross-layer change: verify both backend and frontend builds/tests where feasible.

If verification cannot be run, document the exact command that was skipped and the reason.

## Review Checklist

Before considering work done:

- The change follows existing patterns instead of introducing a parallel style.
- Affected contracts are updated across backend and frontend.
- Authorization, validation, audit, soft-delete, and retention behavior were considered.
- Error and loading states are not silently broken.
- New names are domain-specific and consistent with existing naming.
- No unrelated refactor or generated-file churn is included.
- Documentation in `docs/ai` is updated when architecture, routes, contracts, or workflows change.

## Senior Default

Prefer boring, explicit, maintainable code. Cleverness must pay rent through reduced complexity, stronger correctness, or clear reuse already present in the project.
