# Frontend Map

Frontend root: `../../Frontend`.

Angular version from `package.json`: Angular `21.1.x`, TypeScript `5.9.x`, RxJS `7.8.x`, Vitest/jsdom for tests.

## Application Entry

| File/Class | Responsibility |
|---|---|
| `src/main.ts` | Bootstraps Angular application. |
| `src/app/app.ts` / `App` | Root standalone component with router outlet. |
| `src/app/app.config.ts` / `appConfig` | Registers router, HTTP client, auth/error interceptors, common form modules. |
| `src/app/app.routes.ts` / `routes` | Top-level routing, auth guard, layout wrapper, lazy-loaded features. |

## Routing

Top-level routes:

- `/auth` - public auth feature.
- `/dashboard` - protected dashboard.
- `/assets` - protected assets.
- `/assignments` - protected assignments.
- `/users` - Manager/Admin guard.
- `/categories` - Manager/Admin guard.
- `/locations` - Manager/Admin guard.
- `/audit-logs` - Admin guard.
- `/forbidden` - error page.

Main protected routes render inside `LayoutComponent`.

## Core Layer

Path: `../../Frontend/src/app/core`.

### Services

| Class | Path | Responsibility |
|---|---|---|
| `BaseApiService<T,TCreate,TUpdate>` | `services/base-api.service.ts` | Shared CRUD, paged, delete, restore HTTP calls based on an endpoint name. |
| `AuthService` | `services/auth.service.ts` | Login/logout/current user state, local storage sync, role checks. |
| `AssetService` | `services/asset.service.ts` | Asset API calls plus category/status/location filters. |
| `AssignmentService` | `services/assignment.service.ts` | Assignment API calls plus by-asset/by-user/return operations. |
| `AuditLogService` | `services/audit-log.service.ts` | Audit log reads; disables create/update/delete by overriding unsupported operations. |
| `CategoryService` | `services/category.service.ts` | Category CRUD through base API. |
| `LocationService` | `services/location.service.ts` | Location CRUD through base API. |
| `UserService` | `services/user.service.ts` | User CRUD plus activate/deactivate. |
| `StorageService` | `services/storage.service.ts` | Token and user persistence in browser storage. |

### Guards and Interceptors

| Symbol | Path | Responsibility |
|---|---|---|
| `authGuard` | `guards/auth.guard.ts` | Requires stored token and user; redirects to login otherwise. |
| `roleGuard` / `adminGuard` / `managerGuard` | `guards/role.guard.ts` | Role-based route access. |
| `authInterceptor` | `interceptors/auth.interceptor.ts` | Adds Bearer token to API requests except login. |
| `errorInterceptor` | `interceptors/error.interceptor.ts` | Central HTTP error handling, auth cleanup/redirect on unauthorized. |

### Models

| File | Purpose |
|---|---|
| `models/asset.model.ts` | Asset read/create/update interfaces. |
| `models/assignment.model.ts` | Assignment read/create interfaces. |
| `models/audit-log.model.ts` | Audit log interface. |
| `models/category.model.ts` | Category read/create/update interfaces. |
| `models/location.model.ts` | Location read/create/update interfaces. |
| `models/user.model.ts` | User, create/update user, login request/response. |
| `models/common.model.ts` | `PagedResult`, `ApiError`, `PagedRequest`. |
| `models/enums/*.ts` | Frontend enum mirrors and display labels for backend enums. |

## Shared Layer

Path: `../../Frontend/src/app/shared`.

### Components

| Class | Path | Responsibility |
|---|---|---|
| `LayoutComponent` | `components/layout` | Main application shell around protected routes. |
| `NavbarComponent` | `components/navbar` | Navigation and user/session actions. |
| `PageHeaderComponent` | `components/page-header` | Reusable page title, breadcrumbs, actions, search. |
| `DataTableComponent` | `components/data-table` | Reusable table surface. |
| `ConfirmDialogComponent` | `components/confirm-dialog` | Reusable confirmation UI. |
| `LoadingSpinnerComponent` | `components/loading-spinner` | Loading state component. |

### Directives and Pipes

| Class | Path | Responsibility |
|---|---|---|
| `HasRoleDirective` | `directives/has-role.directive.ts` | Conditionally renders templates based on roles. |
| `AssetStatusPipe` | `pipes/asset-status.pipe.ts` | Converts asset status enum to display label. |
| `AssignmentTypePipe` | `pipes/assignment-type.pipe.ts` | Converts assignment type enum to display label. |
| `UserRolePipe` | `pipes/user-role.pipe.ts` | Converts user role enum to display label. |

## Feature Layer

Path: `../../Frontend/src/app/features`.

| Feature | Main Classes | Responsibility |
|---|---|---|
| `auth` | `LoginComponent`, `auth.routes.ts` | Login screen and auth routing. |
| `dashboard` | `DashboardComponent`, `dashboard.routes.ts` | Dashboard metrics and quick overview. |
| `assets` | `AssetsListComponent`, `AssetFormComponent`, `AssetDetailComponent` | Asset listing, filtering, create/edit, detail. |
| `assignments` | `AssignmentsListComponent`, `AssignmentFormComponent`, `AssignmentDetailComponent` | Assignment listing, create, return, detail. |
| `users` | `UsersListComponent`, `UserFormComponent`, `UserDetailComponent` | User administration and detail views. |
| `categories` | `CategoriesListComponent`, `CategoryFormComponent` | Category management. |
| `locations` | `LocationsListComponent`, `LocationFormComponent` | Location management. |
| `audit-logs` | `AuditLogsListComponent` | Admin audit log browsing. |
| `errors` | `ForbiddenComponent` | Forbidden access page. |

## Frontend/Backend Contract Notes

- `environment.ts` and `environment.prod.ts` both currently point to `http://localhost:5235/api`.
- Storage keys are configured in `environment.ts` as `asset_mgmt_token` and `asset_mgmt_user`.
- Role and enum numeric values must stay aligned with backend enums.
- `BaseApiService.restore(id)` expects backend restore endpoints shaped as `POST /{endpoint}/{id}/restore`.
- Paged APIs expect `page`, `pageSize`, and optional `searchTerm`.
- The frontend stores JWT and user data using keys from environment config.

## Current Implementation Notes

See `frontend-implementation-notes.md` for the verified state of list filtering, dashboard data, direct browser confirms, form data loading, and known frontend/API gaps.
