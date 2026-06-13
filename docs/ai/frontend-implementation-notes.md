# Frontend Implementation Notes

Purpose: capture the verified frontend state from code inspection so future work starts from facts, not assumptions.

Frontend root: `../../Frontend`.

## Verified Access

The frontend source is available and was inspected under `../../Frontend/src/app`. The application uses Angular standalone components, lazy route files, functional guards/interceptors, and local feature styles.

## Routing Inventory

Top-level routes in `src/app/app.routes.ts`:

- `/auth` - public auth feature.
- `/dashboard` - protected by `authGuard` through `LayoutComponent`.
- `/assets` - protected by `authGuard`.
- `/assignments` - protected by `authGuard`.
- `/users` - protected by `managerGuard`.
- `/categories` - protected by `managerGuard`.
- `/locations` - protected by `managerGuard`.
- `/audit-logs` - protected by `adminGuard`.
- `/forbidden` - public error page outside the main layout.

Feature route shapes:

- `auth`: `login`.
- `dashboard`: index component only.
- `assets`: list, `create`, `edit/:id`, `:id`.
- `assignments`: list, `create`, `:id`.
- `users`: list, `create`, `edit/:id`, `:id`.
- `categories`: list, `create`, `edit/:id`.
- `locations`: list, `create`, `edit/:id`.
- `audit-logs`: list only.
- `errors`: forbidden page only.

## API Service Inventory

All API clients read `environment.apiUrl`, currently `http://localhost:5235/api`.

| Service | Endpoint | Notes |
|---|---|---|
| `BaseApiService` | dynamic | Provides `getAll`, `getPaged`, `getById`, `create`, `update`, `delete`, `restore`. |
| `AuthService` | `auth` | Login, logout, current user, local auth state. |
| `AssetService` | `assets` | Base CRUD plus category/status/location reads. |
| `AssignmentService` | `assignments` | Base create/read plus by-asset, by-user, return asset. |
| `AuditLogService` | `auditlogs` | Paged/entity/user reads; create/update/delete throw intentionally. |
| `CategoryService` | `categories` | Base CRUD. |
| `LocationService` | `locations` | Base CRUD. |
| `UserService` | `users` | Base CRUD plus activate/deactivate. |
| `StorageService` | browser storage | Persists JWT and current user via environment storage keys. |

## Screen Behavior

### Dashboard

`DashboardComponent` currently uses static metrics:

- `totalAssets: 125`
- `activeAssignments: 78`
- `totalUsers: 45`
- `availableAssets: 47`

It injects domain services, but does not call them. Treat dashboard numbers as placeholders until a dashboard API or aggregation strategy is implemented.

### Assets

`AssetsListComponent` uses `AssetService.getPaged()` with debounced search and page/pageSize. Status filtering is applied client-side to the current page returned by the API, so counts and filtered results are page-local, not global.

`AssetFormComponent` supports create/edit/delete and declares `categories` and `locations`, but the inspected code does not load category/location options. The template expects these arrays for select options. Fix this before treating asset create/edit as complete.

`AssetDetailComponent` loads asset detail and also requests related assignments and audit logs based on the asset id.

### Assignments

`AssignmentsListComponent` uses `AssignmentService.getPaged()` with debounced search. Active/returned filtering is applied client-side to the current page.

`AssignmentFormComponent` loads assets and users in parallel using `toPromise()` and filters available assets by numeric status `0`. Prefer replacing this with `forkJoin` or `firstValueFrom`, and use `AssetStatus.Available` instead of a magic number.

Return flows call `POST /api/assignments/{id}/return`.

### Users

`UsersListComponent` uses `UserService.getPaged()` with debounced search. Status and role filters are applied client-side to the current page. Activate/deactivate calls use dedicated service methods. The current user cannot deactivate themselves from the list.

`UserFormComponent` handles create/edit with password required only during create.

`UserDetailComponent` supports activate/deactivate and reloads the user after state changes.

### Categories and Locations

`CategoriesListComponent` and `LocationsListComponent` use `getAll()` and perform search/filtering client-side across the loaded collection. They have inline create/edit/delete forms in the list screen.

Separate `category-form` and `location-form` route components also exist. Keep an eye on duplicated create/edit UX when changing these domains.

### Audit Logs

`AuditLogsListComponent` requires Admin in both route guard and component logic. It uses `getPaged()` with user email as `searchTerm`, then applies entity/action/date filters client-side to the current page. This can miss matching records outside the current page.

## Auth, Roles, and Storage

- `authInterceptor` adds `Authorization: Bearer <token>` to requests except `/auth/login`.
- `errorInterceptor` clears storage and redirects on `401`, redirects to `/forbidden` on `403`, and maps other HTTP failures to thrown `Error`.
- `authGuard` depends on stored token and user.
- `roleGuard` compares stored `UserRole` values.
- `AuthService.hasRole()` and `hasAnyRole()` compare `roleName` strings.
- `HasRoleDirective` supports both enum and string roles.

Role names and enum values must remain aligned with backend claims/DTOs.

## Shared UI State

Reusable shared components exist for layout, navbar, page header, loading spinner, data table, and confirm dialog. Despite that, several important flows still use native `confirm()`:

- asset delete
- assignment return
- user deactivate
- category delete
- location delete

Prefer migrating these to `ConfirmDialogComponent` for consistent UX and testability.

## Testing State

Spec files exist for many components, but most generated specs only create the component. There is no evidence of behavior-focused frontend tests for route guards, interceptors, services, filtering, or form submit flows.

For meaningful frontend changes, add focused specs around the behavior being changed rather than relying on generated creation tests.

## Known Frontend Risks

- Dashboard data is static.
- Some filters are client-side after server paging, which can produce incomplete filtered results.
- Asset form select data for categories and locations is not loaded in the inspected code.
- `AssignmentFormComponent` uses deprecated promise conversion and a magic enum value.
- Native `confirm()` is still used despite a shared confirm component.
- `StorageService.setUser(user: any)` and shared table contracts use broad `any`; avoid spreading that style into domain code.
- Many components manually call `ChangeDetectorRef.detectChanges()` after subscriptions. Verify the need before copying this pattern.
- `environment.prod.ts` points to localhost according to `frontend-map.md`; deployment needs environment-specific API configuration.

## Recommended Frontend Next Steps

1. Load categories and locations in `AssetFormComponent`.
2. Replace dashboard placeholder metrics with a backend aggregate endpoint or clearly calculated service calls.
3. Move global filters to server-side query parameters where paging correctness matters.
4. Replace `toPromise()` in assignment form.
5. Migrate destructive native confirms to `ConfirmDialogComponent`.
6. Add behavior tests for guards, interceptors, key services, and high-risk forms.
