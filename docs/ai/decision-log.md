# Decision Log

Purpose: record important architecture decisions, their consequences, and when to revisit them. This is a lightweight ADR file, not a full process.

## ADR-001: Layered Clean Architecture Backend

Status: accepted.

Decision: keep backend split into `Domain`, `Application`, `Infrastructure`, and `API`.

Consequences:

- Controllers stay thin and delegate use cases to application services.
- DTOs and validators live in application layer.
- EF Core and repositories stay in infrastructure.
- Domain entities do not depend on infrastructure.

Revisit if:

- Use cases become too complex for service classes and need command/query handlers.
- Repository abstraction starts hiding important EF behavior or creating duplicate query logic.

## ADR-002: Angular Standalone Feature Structure

Status: accepted.

Decision: keep frontend organized as `core`, `shared`, and lazy-loaded `features` with standalone components.

Consequences:

- `core` owns singleton services, guards, interceptors, and models.
- `shared` owns reusable UI primitives.
- `features` own routed screens and workflow-specific state.
- Feature routes are loaded through `loadChildren` and components through `loadComponent`.

Revisit if:

- Shared UI grows into a real design system.
- State management becomes too complex for component-local state and services.

## ADR-003: JWT Bearer Authentication with Client-Side Logout

Status: accepted for current scope.

Decision: authenticate through JWT bearer tokens and let logout remove the token on the client.

Consequences:

- API remains stateless for auth.
- Logout does not revoke already issued tokens.
- Token storage and expiry behavior must be handled carefully on frontend.

Revisit if:

- Production security requires immediate token revocation.
- Refresh tokens, device sessions, or account lockout policies are introduced.

## ADR-004: Role-Based Authorization

Status: accepted.

Decision: use role-based authorization with `Admin`, `Manager`, and `Employee`.

Consequences:

- Backend `[Authorize(Roles = "...")]` attributes are the source of truth.
- Frontend guards and visibility checks mirror backend rules for UX.
- Role names and enum values must stay aligned across backend DTOs, JWT claims, and frontend models.

Revisit if:

- Permissions become more granular than these three roles.
- Per-resource ownership rules are required.

## ADR-005: Result-Based Business Failures

Status: accepted.

Decision: application services usually return `Result<T>` or `Result` for expected business failures instead of throwing exceptions.

Consequences:

- Controllers map service failures to HTTP responses explicitly.
- Exception middleware is mainly for unexpected or exceptional failures.
- Error shape can vary because many controllers return plain strings for `result.Error`.

Revisit if:

- API clients need structured error codes consistently.
- Validation/business failures should share one response envelope.

## ADR-006: Soft Delete with Restore and Retention Cleanup

Status: accepted.

Decision: important records use soft delete, restore endpoints, and retention cleanup for permanent deletion.

Consequences:

- Queries must respect deleted state through filters/repository methods.
- Restore and cleanup paths must be maintained whenever entity lifecycle changes.
- Manual cleanup can permanently delete data and must be treated as an operational action.

Revisit if:

- Compliance requires different retention periods.
- Audit requirements require immutable records or legal holds.

## ADR-007: Middleware-Based Audit Logging

Status: accepted with known limitations.

Decision: current audit logging uses middleware for successful modifying HTTP requests.

Consequences:

- Audit logging is centralized and easy to apply broadly.
- Current audit entries lack precise entity id and change details.
- Business-specific audit semantics are limited.

Revisit if:

- Audit logs need exact changed fields, entity ids, before/after snapshots, or transaction-level consistency.
- Compliance requires auditable user intent rather than generic HTTP method logging.

## ADR-008: PostgreSQL with EF Core

Status: accepted.

Decision: use PostgreSQL through EF Core and Npgsql.

Consequences:

- Migrations live in infrastructure.
- Repository implementations can use EF Core features and PostgreSQL behavior.
- Deployment must manage database migrations explicitly.

Revisit if:

- Multi-database support becomes a requirement.
- Query performance requires specialized SQL or read models.

## ADR-009: Local Development Seed Data

Status: accepted for local development only.

Decision: seed categories, locations, sample assets, and a known admin when the users table is empty.

Consequences:

- Local startup is easy.
- Deterministic credentials are unsafe outside development.
- Seeding currently runs based on data state, not environment.

Revisit before:

- staging or production deployment
- exposing the app outside a local developer machine

## ADR-010: AI Documentation as Repository-Level Context

Status: accepted.

Decision: keep AI/developer documentation in repository-level `docs/ai` because it covers both backend and frontend.

Consequences:

- Future AI sessions should read `README.md` and `engineering-standards.md` first.
- Architecture maps and implementation notes should be updated when contracts or workflows change.
- Documentation is descriptive and does not replace tests or code review.

Revisit if:

- Documentation becomes too large and needs generated indexes.
- Separate team ownership requires splitting backend/frontend docs.
