# Frontend Development Guide

Purpose: give future changes a consistent Angular implementation path without rediscovering conventions from every feature.

Frontend root: `../../Frontend`.

## Current Stack

- Angular `21.1.x` with standalone components and lazy route files.
- TypeScript `5.9.x`.
- RxJS `7.8.x`.
- Unit tests through Angular's `@angular/build:unit-test` builder with Vitest/jsdom dependencies.
- Global CSS in `src/styles.css`; feature-level shared styles in `features/*/*-shared.styles.css`.

## Layering Rules

Keep frontend code in the existing three-layer shape:

- `core` for singleton services, guards, interceptors, environment-driven API access, and shared contracts.
- `shared` for reusable UI components, directives, and pipes that do not own business flows.
- `features` for routed business screens. A feature should contain its own routes plus list/form/detail components when applicable.

Do not put API calls directly in components when a domain service already exists or clearly should exist. Components should coordinate UI state, forms, navigation, and service calls.

## Routing Pattern

Top-level routing lives in `src/app/app.routes.ts`.

- Public auth routes are outside `LayoutComponent`.
- Protected business routes are children of `LayoutComponent` and guarded by `authGuard`.
- Role-restricted feature roots use `managerGuard` or `adminGuard` at the top-level route.
- Feature route files use `loadComponent` for standalone screens.

When adding a feature:

1. Add `features/<feature>/<feature>.routes.ts`.
2. Register it in `app.routes.ts` under the protected layout unless it is intentionally public.
3. Apply the narrowest role guard at the highest practical route level.
4. Add navigation only if the target role should discover the feature from the shell.

## API Service Pattern

CRUD-like domains should extend `BaseApiService<T, TCreate, TUpdate>` and define only:

- `protected readonly endpoint`
- domain-specific read operations or commands
- overrides for unsupported operations

`BaseApiService` assumes these backend shapes:

- `GET /api/{endpoint}`
- `GET /api/{endpoint}/paged?page=&pageSize=&searchTerm=`
- `GET /api/{endpoint}/{id}`
- `POST /api/{endpoint}`
- `PUT /api/{endpoint}/{id}`
- `DELETE /api/{endpoint}/{id}`
- `POST /api/{endpoint}/{id}/restore`

If the backend route does not follow this shape, keep the exception explicit in the concrete service rather than adding conditionals to `BaseApiService`.

Current concrete exceptions and extensions:

- `AssetService` adds `category/{categoryId}`, `status/{status}`, and `location/{locationId}` reads.
- `AssignmentService` adds `asset/{assetId}`, `user/{userId}`, and `{id}/return`.
- `UserService` adds `{id}/activate` and `{id}/deactivate`.
- `AuditLogService` adds entity/user reads and intentionally throws for create/update/delete.

## Models and Contracts

Frontend models live in `src/app/core/models`.

- Keep request interfaces separate from read models (`Create*Request`, `Update*Request`).
- Keep enum numeric values aligned with backend enums in `AssetManagement.Domain/Enums`.
- Update enum labels and pipes when backend enum names or meanings change.
- Update `models/index.ts` when adding a contract that should be imported elsewhere.

Before changing a contract, inspect the matching backend DTO, validator, AutoMapper profile, controller action, Angular service, and every form that writes the model.

## Auth and Roles

Authentication state is owned by `AuthService` and persisted by `StorageService` with keys from `environment.ts`.

- `authInterceptor` adds the bearer token to API requests.
- `errorInterceptor` handles HTTP failures and clears auth on unauthorized responses.
- `authGuard` requires token and user state.
- `roleGuard`, `adminGuard`, and `managerGuard` protect routes by `UserRole`.
- `HasRoleDirective` controls role-based template visibility.

Route guards protect navigation, but UI visibility is not authorization. Backend policies and attributes remain the source of truth.

## UI Component Usage

Prefer existing shared components before creating new feature-local UI primitives:

- `LayoutComponent` and `NavbarComponent` for shell/navigation.
- `PageHeaderComponent` for title, breadcrumbs, actions, and search affordances.
- `DataTableComponent` for tabular list screens.
- `ConfirmDialogComponent` for destructive or irreversible actions.
- `LoadingSpinnerComponent` for async loading states.

Feature-specific CSS should stay close to the feature. Repeated layout rules shared by components in one domain belong in that feature's `*-shared.styles.css`; truly cross-feature styles belong in `shared` or global CSS only when they are stable.

## Testing Expectations

For frontend changes, run from `../../Frontend`:

```bash
npm test
npm run build
```

Focused tests are enough for a narrow component/service change, but broaden coverage when touching guards, interceptors, shared components, or shared models. Add or update specs when a change modifies validation, navigation, role behavior, request payloads, or visible workflow state.

## Review Checklist

Before finishing a frontend change:

- The route is reachable and protected by the expected guard.
- The API service endpoint matches `api-map.md` and backend controller routes.
- Create/update forms send DTO-compatible payloads.
- Error and loading states are represented in the component.
- Role-specific actions are hidden in the UI and enforced by the backend.
- Enum labels, pipes, and backend enum values still match.
- Build and relevant tests pass, or the failure is documented with the exact command.

Also check `frontend-implementation-notes.md` before changing list screens or dashboard behavior; several current filters are client-side and dashboard metrics are static placeholders.
