# Backend Class Map

Use this file to find the right backend class quickly. Paths are relative to the backend root.

## API Layer

### Startup and Composition

| Class/File | Responsibility | Look Here When |
|---|---|---|
| `Program.cs` | Application bootstrap, middleware pipeline, Swagger, auth/authorization, CORS, controller mapping, data seeding. | Debugging startup, middleware order, hosted services, seeding. |
| `Extensions/ServiceExtensions.cs` / `ServiceExtensions` | Registers MVC controllers, validation filter, CORS policy, Swagger JWT definition. | Changing API-level service registration, Swagger, CORS. |

### Controllers

| Class | Path | Responsibility |
|---|---|---|
| `AuthController` | `AssetManagement.API/Controllers/AuthController.cs` | Public login plus authenticated logout/current-user endpoints. Delegates to `IAuthService`. |
| `AssetsController` | `AssetManagement.API/Controllers/AssetsController.cs` | Asset read endpoints, paged search, filter by category/status/location, create/update/delete/restore. |
| `AssignmentsController` | `AssetManagement.API/Controllers/AssignmentsController.cs` | Assignment listing, paging, lookup by asset/user, create assignment, return asset, delete, bulk return, active assignments. |
| `AuditLogsController` | `AssetManagement.API/Controllers/AuditLogsController.cs` | Admin-only audit log paging and filtering by entity/user. |
| `CategoriesController` | `AssetManagement.API/Controllers/CategoriesController.cs` | Category CRUD, paging, restore. |
| `DataRetentionController` | `AssetManagement.API/Controllers/DataRetentionController.cs` | Admin-only retention status and cleanup operations. |
| `LocationsController` | `AssetManagement.API/Controllers/LocationsController.cs` | Location CRUD, paging, restore. |
| `UsersController` | `AssetManagement.API/Controllers/UsersController.cs` | User CRUD, paging, activate/deactivate, restore. Mostly admin-only operations. |

Controller pattern: controllers are thin. They call an application service, inspect `Result`, and return `Ok`, `CreatedAtAction`, `NoContent`, `BadRequest`, or `NotFound`.

### Middleware, Filters, Background Services

| Class | Path | Responsibility |
|---|---|---|
| `ExceptionHandlingMiddleware` | `AssetManagement.API/Middleware/ExceptionHandlingMiddleware.cs` | Converts known application exceptions to JSON HTTP responses and logs errors. |
| `ErrorResponse` | same file | JSON error payload used by exception middleware. |
| `ExceptionHandlingMiddlewareExtensions` | same file | Adds `UseExceptionHandling()` extension. |
| `AuditLoggingMiddleware` | `AssetManagement.API/Middleware/AuditLoggingMiddleware.cs` | Logs successful POST/PUT/DELETE requests after the response. Currently records `Guid.Empty` as entity id. |
| `AuditLoggingMiddlewareExtensions` | same file | Adds `UseAuditLogging()` extension. |
| `ValidationFilter` | `AssetManagement.API/Filters/ValidationFilter.cs` | Converts invalid model state into a validation response before controller action execution. |
| `DataCleanupBackgroundService` | `AssetManagement.API/BackgroundServices/DataCleanupBackgroundService.cs` | Periodically executes retention cleanup through `IDataCleanupService`. |

## Application Layer

### Services

| Class | Path | Responsibility |
|---|---|---|
| `AuthService` | `AssetManagement.Application/Services/AuthService.cs` | Validates credentials, checks active user, generates JWT, returns current user. Logout is client-side token removal. |
| `AssetService` | `AssetManagement.Application/Services/AssetService.cs` | Asset use cases: get/list/page/create/update/delete/filter/restore. Enforces serial uniqueness, category existence, location existence, active-assignment delete block. |
| `AssignmentService` | `AssetManagement.Application/Services/AssignmentService.cs` | Assignment use cases: create assignment, return asset, delete assignment, bulk return, list active/paged/by asset/by user. Updates asset status during assignment lifecycle. |
| `AuditService` | `AssetManagement.Application/Services/AuditService.cs` | Creates audit log entries and reads audit data by entity, user, or page. |
| `CategoryService` | `AssetManagement.Application/Services/CategoryService.cs` | Category CRUD, paging, delete with asset usage guard, restore. |
| `LocationService` | `AssetManagement.Application/Services/LocationService.cs` | Location CRUD, paging, delete with asset usage guard, restore. |
| `UserService` | `AssetManagement.Application/Services/UserService.cs` | User CRUD, paging, password hashing on create, activation/deactivation, restore. |
| `DataCleanupService` | `AssetManagement.Application/Services/DataCleanupService.cs` | Retention status and cleanup for soft-deleted categories, locations, users, assets, and audit logs. |

Service pattern: services use `IUnitOfWork`, repository interfaces, AutoMapper, and return `Result`/`Result<T>` instead of throwing for normal business failures.

### Service Interfaces

| Interface/Class | Path | Purpose |
|---|---|---|
| `IAuthService` | `AssetManagement.Application/Interfaces/IAuthService.cs` | Contract for login/logout/current user. |
| `IAssetService` | `AssetManagement.Application/Interfaces/IAssetService.cs` | Contract for asset use cases. |
| `IAssignmentService` | `AssetManagement.Application/Interfaces/IAssignmentService.cs` | Contract for assignment use cases. |
| `IAuditService` | `AssetManagement.Application/Interfaces/IAuditService.cs` | Contract for audit write/read operations. |
| `ICategoryService` | `AssetManagement.Application/Interfaces/ICategoryService.cs` | Contract for category use cases. |
| `ILocationService` | `AssetManagement.Application/Interfaces/ILocationService.cs` | Contract for location use cases. |
| `IUserService` | `AssetManagement.Application/Interfaces/IUserService.cs` | Contract for user use cases. |
| `IDataCleanupService` | `AssetManagement.Application/Interfaces/IDataCleanupService.cs` | Contract for cleanup execution and retention status. |
| `IJwtTokenGenerator` | `AssetManagement.Application/Interfaces/IJwtTokenGenerator.cs` | Abstraction for JWT generation. |
| `IPasswordHasher` | `AssetManagement.Application/Interfaces/Security/IPasswordHasher.cs` | Abstraction for password hashing/verification. |

### Repository Interfaces

| Interface | Path | Purpose |
|---|---|---|
| `IUnitOfWork` | `AssetManagement.Application/Interfaces/Repositories/IUnitOfWork.cs` | Aggregates repositories and transaction/save operations. |
| `IAssetRepository` | `AssetManagement.Application/Interfaces/Repositories/IAssetRepository.cs` | Asset data access, filters, paging, soft-delete cleanup. |
| `IAssignmentRepository` | `AssetManagement.Application/Interfaces/Repositories/IAssignmentRepository.cs` | Assignment data access and active-assignment checks. |
| `IAuditLogRepository` | `AssetManagement.Application/Interfaces/Repositories/IAuditLogRepository.cs` | Audit log queries and cleanup. |
| `ICategoryRepository` | `AssetManagement.Application/Interfaces/Repositories/ICategoryRepository.cs` | Category data access, uniqueness, usage checks, cleanup. |
| `ILocationRepository` | `AssetManagement.Application/Interfaces/Repositories/ILocationRepository.cs` | Location data access, usage checks, cleanup. |
| `IUserRepository` | `AssetManagement.Application/Interfaces/Repositories/IUserRepository.cs` | User data access, email lookup/uniqueness, activation/deletion queries. |

### DTOs and Result Types

| Class | Path | Purpose |
|---|---|---|
| `Result<T>` / `Result` | `AssetManagement.Application/DTOs/Common/Result.cs` | Standard service result wrapper for success, data, single error, and error list. |
| `PagedResult<T>` | `AssetManagement.Application/DTOs/Common/PagedResult.cs` | Standard paged response with items, total count, page metadata, navigation flags. |
| `AssetDto`, `CreateAssetDto`, `UpdateAssetDto` | `AssetManagement.Application/DTOs/Assets` | API/application contracts for asset read/create/update. |
| `AssignmentDto`, `CreateAssignmentDto` | `AssetManagement.Application/DTOs/Assignments` | API/application contracts for assignment read/create. |
| `CategoryDto`, `CreateCategoryDto`, `UpdateCategoryDto` | `AssetManagement.Application/DTOs/Categories` | API/application contracts for category read/create/update. |
| `LocationDto`, `CreateLocationDto`, `UpdateLocationDto` | `AssetManagement.Application/DTOs/Locations` | API/application contracts for location read/create/update. |
| `UserDto`, `CreateUserDto`, `UpdateUserDto`, `LoginDto`, `LoginResponseDto` | `AssetManagement.Application/DTOs/Users` | User identity/profile and auth contracts. |

### Validators

| Class | Path | Validates |
|---|---|---|
| `LoginValidator` | `AssetManagement.Application/Validators/LoginValidator.cs` | Login email/password shape. |
| `CreateUserValidator` | `AssetManagement.Application/Validators/CreateUserValidator.cs` | Required user fields, email, password, names, role. |
| `CreateAssetValidator` | `AssetManagement.Application/Validators/CreateAssetValidator.cs` | Required asset fields, serial number, purchase date, price/status/category/location inputs. |
| `CreateAssignmentValidator` | `AssetManagement.Application/Validators/CreateAssignmentValidator.cs` | Asset/user/type and future expected return date. |
| `CreateCategoryValidator` | `AssetManagement.Application/Validators/CreateCategoryValidator.cs` | Category name/code/description. |
| `CreateLocationValidator` | `AssetManagement.Application/Validators/CreateLocationValidator.cs` | Location name/address/building/floor/room/description. |

### Mapping and Configuration

| Class | Path | Responsibility |
|---|---|---|
| `MappingProfile` | `AssetManagement.Application/Mappings/MappingProfile.cs` | AutoMapper profile between entities and DTOs. |
| `DependencyInjection` | `AssetManagement.Application/DependencyInjection.cs` | Registers application services, validators, AutoMapper. |
| `DataRetentionOptions` | `AssetManagement.Application/Configuration/DataRetentionOptions.cs` | Strongly typed cleanup retention settings. |

### Cleanup Result Models

Defined in `AssetManagement.Application/Interfaces/IDataCleanupService.cs`.

| Class | Purpose |
|---|---|
| `DataCleanupResult` | Counts deleted records by type, warnings, timestamp. |
| `DataRetentionStatus` | Pending deletion lists and retention policies. |
| `PendingDeletionItem` | Generic pending soft-deleted item. |
| `PendingAuditLogDeletionItem` | Pending audit log cleanup item. |
| `RetentionPolicies` | Effective retention durations. |

### Exceptions

| Class | Path | Use |
|---|---|---|
| `ValidationException` | `AssetManagement.Application/Exceptions/ValidationException.cs` | Validation failures with error list. |
| `NotFoundException` | `AssetManagement.Application/Exceptions/NotFoundException.cs` | Missing resource exception. |
| `BusinessException` | `AssetManagement.Application/Exceptions/BusinessException.cs` | Business rule failure with optional code. |

Current note: most services currently return `Result` for business failures rather than throwing these exceptions.

## Domain Layer

### Entities

| Class | Path | Responsibility |
|---|---|---|
| `BaseEntity` | `AssetManagement.Domain/Entities/Common/BaseEntity.cs` | Shared `Id`, timestamps, and soft-delete fields for main entities. |
| `User` | `AssetManagement.Domain/Entities/User.cs` | System user with identity, role, active state, password hash, assignments, audit logs. |
| `Asset` | `AssetManagement.Domain/Entities/Asset.cs` | Physical/software asset with serial number, category, location, status, assignments. |
| `Assignment` | `AssetManagement.Domain/Entities/Assignment.cs` | Asset-to-user assignment with type, assigned/returned dates, expected return, active flag. |
| `Category` | `AssetManagement.Domain/Entities/Category.cs` | Asset category with code/description and assets collection. |
| `Location` | `AssetManagement.Domain/Entities/Location.cs` | Physical location data and assets collection. |
| `AuditLog` | `AssetManagement.Domain/Entities/AuditLog.cs` | Audit entry for entity/action/user/time/IP/changes. Does not inherit `BaseEntity`. |

### Enums

| Enum | Path | Values |
|---|---|---|
| `UserRole` | `AssetManagement.Domain/Enums/UserRole.cs` | `Admin`, `Manager`, `Employee`. |
| `AssetStatus` | `AssetManagement.Domain/Enums/AssetStatus.cs` | `Available`, `Assigned`, `InMaintenance`, `Retired`, `Lost`. |
| `AssignmentType` | `AssetManagement.Domain/Enums/AssignmentType.cs` | `Permanent`, `Temporary`, `Loan`. |
| `AuditAction` | `AssetManagement.Domain/Enums/AuditAction.cs` | Audit operation names used by audit logging. |

## Infrastructure Layer

### Persistence

| Class | Path | Responsibility |
|---|---|---|
| `ApplicationDbContext` | `AssetManagement.Infrastructure/Data/ApplicationDbContext.cs` | EF Core DbContext, DbSets, model configuration, query filters, timestamp updates on save. |
| `DataSeeder` | `AssetManagement.Infrastructure/Data/Seed/DataSeeder.cs` | Seeds initial categories, locations, admin user, sample assets if there are no users. |

### EF Configurations

| Class | Path | Configures |
|---|---|---|
| `UserConfiguration` | `AssetManagement.Infrastructure/Data/Configurations/UserConfiguration.cs` | User table, constraints, indexes, relationships. |
| `AssetConfiguration` | `AssetManagement.Infrastructure/Data/Configurations/AssetConfiguration.cs` | Asset table, serial uniqueness, category/location relationships. |
| `AssignmentConfiguration` | `AssetManagement.Infrastructure/Data/Configurations/AssignmentConfiguration.cs` | Assignment table, asset/user relationships and assignment fields. |
| `CategoryConfiguration` | `AssetManagement.Infrastructure/Data/Configurations/CategoryConfiguration.cs` | Category table and indexes. |
| `LocationConfiguration` | `AssetManagement.Infrastructure/Data/Configurations/LocationConfiguration.cs` | Location table. |
| `AuditLogConfiguration` | `AssetManagement.Infrastructure/Data/Configurations/AuditLogConfiguration.cs` | Audit log table, indexes, action/user/entity fields. |

### Repository Implementations

| Class | Path | Responsibility |
|---|---|---|
| `UnitOfWork` | `AssetManagement.Infrastructure/Repositories/Implementations/UnitOfWork.cs` | Coordinates repository instances, `SaveChangesAsync`, EF transactions, dispose. |
| `AssetRepository` | `AssetManagement.Infrastructure/Repositories/Implementations/AssetRepository.cs` | Asset queries, paging, filtering, soft delete, restore lookup, cleanup. |
| `AssignmentRepository` | `AssetManagement.Infrastructure/Repositories/Implementations/AssignmentRepository.cs` | Assignment queries with includes, active assignment lookup, paging/search, delete. |
| `AuditLogRepository` | `AssetManagement.Infrastructure/Repositories/Implementations/AuditLogRepository.cs` | Audit log queries by entity/user/action/date, paging/search, cleanup. |
| `CategoryRepository` | `AssetManagement.Infrastructure/Repositories/Implementations/CategoryRepository.cs` | Category queries, uniqueness, asset usage checks, soft delete, cleanup. |
| `LocationRepository` | `AssetManagement.Infrastructure/Repositories/Implementations/LocationRepository.cs` | Location queries, asset usage checks, soft delete, cleanup. |
| `UserRepository` | `AssetManagement.Infrastructure/Repositories/Implementations/UserRepository.cs` | User lookup, role/active queries, paging/search, email uniqueness, soft delete, cleanup. |

### Security and DI

| Class | Path | Responsibility |
|---|---|---|
| `DependencyInjection` | `AssetManagement.Infrastructure/DependencyInjection.cs` | Registers DbContext, repositories, unit of work, password hasher, JWT generator, JWT bearer auth. |
| `PasswordHasher` | `AssetManagement.Infrastructure/Security/PasswordHasher.cs` | Hashes and verifies passwords using ASP.NET Core password hashing primitives. |
| `JwtTokenGenerator` | `AssetManagement.Infrastructure/Security/JwtTokenGenerator.cs` | Creates JWT access token with user identity and role claims. |
| `JwtSettings` | `AssetManagement.Infrastructure/Security/JwtSettings.cs` | Strongly typed JWT configuration. |

### Migrations

Migration classes live in `AssetManagement.Infrastructure/Migrations`. They document database evolution:

- `InitialCreate`
- `AddQueryFilters`
- `FixSoftDeleteWithCorrectColumnNames`
- `FinalSoftDeleteImplementation`
- `ApplicationDbContextModelSnapshot`

Normally do not edit generated migration designer files manually.
