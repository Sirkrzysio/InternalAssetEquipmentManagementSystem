# Business Flows

## Login and Auth

1. Frontend `LoginComponent` submits credentials to `AuthService.login`.
2. `AuthService` calls `POST /api/auth/login`.
3. Backend `AuthController.Login` delegates to `AuthService.LoginAsync`.
4. Backend `AuthService` loads user by email, checks active state, verifies password, generates JWT.
5. Frontend stores token and user through `StorageService`.
6. `authInterceptor` adds the token to later requests.
7. Backend JWT middleware validates issuer, audience, lifetime, signing key, and role claims.

Primary files:

- `AssetManagement.Application/Services/AuthService.cs`
- `AssetManagement.Infrastructure/Security/JwtTokenGenerator.cs`
- `AssetManagement.Infrastructure/Security/PasswordHasher.cs`
- `../../Frontend/src/app/core/services/auth.service.ts`
- `../../Frontend/src/app/core/interceptors/auth.interceptor.ts`

## Asset Lifecycle

Create/update asset:

1. Frontend feature calls `AssetService`.
2. Backend `AssetsController` delegates to `IAssetService`.
3. `AssetService` validates business constraints:
   - serial number uniqueness,
   - category exists,
   - optional location exists.
4. AutoMapper maps DTO to entity.
5. `AssetRepository` persists through EF Core.
6. `UnitOfWork.SaveChangesAsync` commits.

Delete asset:

1. `AssetService.DeleteAsync` checks the asset exists.
2. It blocks deletion if `Assignments.HasActiveAssignmentAsync(id)` is true.
3. Repository sets `DeletedAt` rather than physically deleting.
4. EF query filters hide soft-deleted records.

Restore asset:

1. Repository uses `IgnoreQueryFilters`.
2. `DeletedAt` is set back to null.

Primary files:

- `AssetManagement.API/Controllers/AssetsController.cs`
- `AssetManagement.Application/Services/AssetService.cs`
- `AssetManagement.Infrastructure/Repositories/Implementations/AssetRepository.cs`
- `AssetManagement.Infrastructure/Data/ApplicationDbContext.cs`

## Assignment Lifecycle

Create assignment:

1. User selects asset/user/type in frontend.
2. `AssignmentService.CreateAsync` checks asset and user exist.
3. It checks whether the asset already has an active assignment.
4. It creates assignment and usually marks asset as assigned.
5. Saves through `UnitOfWork`.

Return assignment:

1. `ReturnAssetAsync` loads assignment.
2. It sets `ReturnedAt` and marks assignment inactive.
3. It updates asset status back to available where applicable.

Bulk return:

1. Controller accepts `List<Guid>`.
2. Application service iterates assignment IDs and applies return logic.

Primary files:

- `AssetManagement.API/Controllers/AssignmentsController.cs`
- `AssetManagement.Application/Services/AssignmentService.cs`
- `AssetManagement.Infrastructure/Repositories/Implementations/AssignmentRepository.cs`

## Category and Location Lifecycle

Categories and locations follow similar patterns:

- create/update through service and repository,
- delete is soft delete,
- delete is blocked if there are linked assets,
- restore uses `IgnoreQueryFilters`.

Primary files:

- `CategoryService`, `CategoryRepository`, `CategoriesController`
- `LocationService`, `LocationRepository`, `LocationsController`

## User Lifecycle

Create user:

1. `UserService.CreateAsync` checks email uniqueness.
2. It hashes password through `IPasswordHasher`.
3. User is saved with role and active state.

Deactivate/activate:

- Service toggles `IsActive`.
- Login blocks inactive users.

Delete/restore:

- Delete is soft delete through `DeletedAt`.
- Restore clears `DeletedAt`.

Primary files:

- `AssetManagement.Application/Services/UserService.cs`
- `AssetManagement.Infrastructure/Repositories/Implementations/UserRepository.cs`
- `AssetManagement.API/Controllers/UsersController.cs`

## Audit Logging

Two audit mechanisms matter:

- `AuditService.LogAsync` can write explicit audit entries.
- `AuditLoggingMiddleware` logs successful modifying HTTP requests.

Current caveat: middleware currently infers entity name from path and stores `Guid.Empty` as `EntityId`, so audit entries may not point to the exact changed entity.

Primary files:

- `AssetManagement.Application/Services/AuditService.cs`
- `AssetManagement.API/Middleware/AuditLoggingMiddleware.cs`
- `AssetManagement.Infrastructure/Repositories/Implementations/AuditLogRepository.cs`

## Retention Cleanup

Soft-deleted data can be permanently removed after retention windows.

1. `DataCleanupBackgroundService` periodically invokes `IDataCleanupService`.
2. `DataCleanupService.PerformCleanupAsync` calculates cutoffs from `DataRetentionOptions`.
3. Repositories execute cleanup queries, often using `IgnoreQueryFilters`.
4. `DataRetentionController` exposes admin-triggered cleanup/status operations.

Configured retention values are in `appsettings.json` under `DataRetention`.

Primary files:

- `AssetManagement.Application/Services/DataCleanupService.cs`
- `AssetManagement.API/BackgroundServices/DataCleanupBackgroundService.cs`
- `AssetManagement.API/Controllers/DataRetentionController.cs`
- `AssetManagement.Application/Configuration/DataRetentionOptions.cs`

## Cross-Cutting Save Behavior

`ApplicationDbContext.SaveChangesAsync` updates timestamps for entities derived from `BaseEntity`.

Soft-delete visibility is controlled by query filters in `ApplicationDbContext` and EF configurations.
