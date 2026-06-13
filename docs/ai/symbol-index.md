# Symbol Index

This file is the fast lookup table for named types and exported frontend symbols. Use it when a task mentions a specific class, DTO, service, component, interface, enum, guard, or interceptor.

## Backend Public Types

### API

| Symbol | Kind | Path | Summary |
|---|---|---|---|
| `DataCleanupBackgroundService` | class | `AssetManagement.API/BackgroundServices/DataCleanupBackgroundService.cs` | Hosted service that periodically runs data retention cleanup. |
| `AssetsController` | class | `AssetManagement.API/Controllers/AssetsController.cs` | Asset HTTP API. |
| `AssignmentsController` | class | `AssetManagement.API/Controllers/AssignmentsController.cs` | Assignment HTTP API. |
| `AuditLogsController` | class | `AssetManagement.API/Controllers/AuditLogsController.cs` | Admin audit log HTTP API. |
| `AuthController` | class | `AssetManagement.API/Controllers/AuthController.cs` | Login/logout/current-user HTTP API. |
| `CategoriesController` | class | `AssetManagement.API/Controllers/CategoriesController.cs` | Category HTTP API. |
| `DataRetentionController` | class | `AssetManagement.API/Controllers/DataRetentionController.cs` | Admin retention status/cleanup HTTP API. |
| `LocationsController` | class | `AssetManagement.API/Controllers/LocationsController.cs` | Location HTTP API. |
| `UsersController` | class | `AssetManagement.API/Controllers/UsersController.cs` | User administration HTTP API. |
| `ServiceExtensions` | static class | `AssetManagement.API/Extensions/ServiceExtensions.cs` | API service registration: controllers, validation filter, CORS, Swagger. |
| `ValidationFilter` | class | `AssetManagement.API/Filters/ValidationFilter.cs` | MVC action filter for invalid model state. |
| `AuditLoggingMiddleware` | class | `AssetManagement.API/Middleware/AuditLoggingMiddleware.cs` | Logs successful modifying HTTP requests. |
| `AuditLoggingMiddlewareExtensions` | static class | same | Adds `UseAuditLogging`. |
| `ExceptionHandlingMiddleware` | class | `AssetManagement.API/Middleware/ExceptionHandlingMiddleware.cs` | Converts exceptions to JSON error responses. |
| `ErrorResponse` | class | same | JSON error response DTO for middleware. |
| `ExceptionHandlingMiddlewareExtensions` | static class | same | Adds `UseExceptionHandling`. |

### Application Services and DI

| Symbol | Kind | Path | Summary |
|---|---|---|---|
| `DependencyInjection` | static class | `AssetManagement.Application/DependencyInjection.cs` | Registers application services, validators, AutoMapper. |
| `AssetService` | class | `AssetManagement.Application/Services/AssetService.cs` | Asset use cases and business rules. |
| `AssignmentService` | class | `AssetManagement.Application/Services/AssignmentService.cs` | Assignment/return/bulk-return use cases. |
| `AuditService` | class | `AssetManagement.Application/Services/AuditService.cs` | Audit log write/read use cases. |
| `AuthService` | class | `AssetManagement.Application/Services/AuthService.cs` | Login/current-user auth use cases. |
| `CategoryService` | class | `AssetManagement.Application/Services/CategoryService.cs` | Category CRUD/restore/delete rules. |
| `DataCleanupService` | class | `AssetManagement.Application/Services/DataCleanupService.cs` | Retention cleanup and status. |
| `LocationService` | class | `AssetManagement.Application/Services/LocationService.cs` | Location CRUD/restore/delete rules. |
| `UserService` | class | `AssetManagement.Application/Services/UserService.cs` | User CRUD, activation, password hashing on create. |
| `MappingProfile` | class | `AssetManagement.Application/Mappings/MappingProfile.cs` | AutoMapper entity/DTO mappings. |
| `DataRetentionOptions` | class | `AssetManagement.Application/Configuration/DataRetentionOptions.cs` | Retention configuration model. |

### Application Interfaces

| Symbol | Kind | Path | Summary |
|---|---|---|---|
| `IAssetService` | interface | `AssetManagement.Application/Interfaces/IAssetService.cs` | Asset service contract. |
| `IAssignmentService` | interface | `AssetManagement.Application/Interfaces/IAssignmentService.cs` | Assignment service contract. |
| `IAuditService` | interface | `AssetManagement.Application/Interfaces/IAuditService.cs` | Audit service contract. |
| `IAuthService` | interface | `AssetManagement.Application/Interfaces/IAuthService.cs` | Auth service contract. |
| `ICategoryService` | interface | `AssetManagement.Application/Interfaces/ICategoryService.cs` | Category service contract. |
| `IDataCleanupService` | interface | `AssetManagement.Application/Interfaces/IDataCleanupService.cs` | Cleanup/status contract. |
| `IJwtTokenGenerator` | interface | `AssetManagement.Application/Interfaces/IJwtTokenGenerator.cs` | JWT generation contract. |
| `ILocationService` | interface | `AssetManagement.Application/Interfaces/ILocationService.cs` | Location service contract. |
| `IUserService` | interface | `AssetManagement.Application/Interfaces/IUserService.cs` | User service contract. |
| `IPasswordHasher` | interface | `AssetManagement.Application/Interfaces/Security/IPasswordHasher.cs` | Password hashing/verification contract. |
| `IAssetRepository` | interface | `AssetManagement.Application/Interfaces/Repositories/IAssetRepository.cs` | Asset repository contract. |
| `IAssignmentRepository` | interface | `AssetManagement.Application/Interfaces/Repositories/IAssignmentRepository.cs` | Assignment repository contract. |
| `IAuditLogRepository` | interface | `AssetManagement.Application/Interfaces/Repositories/IAuditLogRepository.cs` | Audit log repository contract. |
| `ICategoryRepository` | interface | `AssetManagement.Application/Interfaces/Repositories/ICategoryRepository.cs` | Category repository contract. |
| `ILocationRepository` | interface | `AssetManagement.Application/Interfaces/Repositories/ILocationRepository.cs` | Location repository contract. |
| `IUnitOfWork` | interface | `AssetManagement.Application/Interfaces/Repositories/IUnitOfWork.cs` | Repository aggregate and transaction contract. |
| `IUserRepository` | interface | `AssetManagement.Application/Interfaces/Repositories/IUserRepository.cs` | User repository contract. |

### Application DTOs, Results, Validators, Exceptions

| Symbol | Kind | Path | Summary |
|---|---|---|---|
| `AssetDto`, `CreateAssetDto`, `UpdateAssetDto` | classes | `AssetManagement.Application/DTOs/Assets` | Asset read/create/update contracts. |
| `AssignmentDto`, `CreateAssignmentDto` | classes | `AssetManagement.Application/DTOs/Assignments` | Assignment read/create contracts. |
| `CategoryDto`, `CreateCategoryDto`, `UpdateCategoryDto` | classes | `AssetManagement.Application/DTOs/Categories` | Category read/create/update contracts. |
| `LocationDto`, `CreateLocationDto`, `UpdateLocationDto` | classes | `AssetManagement.Application/DTOs/Locations` | Location read/create/update contracts. |
| `UserDto`, `CreateUserDto`, `UpdateUserDto`, `LoginDto`, `LoginResponseDto` | classes | `AssetManagement.Application/DTOs/Users` | User and auth contracts. |
| `Result<T>`, `Result` | classes | `AssetManagement.Application/DTOs/Common/Result.cs` | Success/failure wrapper. |
| `PagedResult<T>` | class | `AssetManagement.Application/DTOs/Common/PagedResult.cs` | Standard paginated result. |
| `DataCleanupResult`, `DataRetentionStatus`, `PendingDeletionItem`, `PendingAuditLogDeletionItem`, `RetentionPolicies` | classes | `AssetManagement.Application/Interfaces/IDataCleanupService.cs` | Cleanup status/result payloads. |
| `CreateAssetValidator` | class | `AssetManagement.Application/Validators/CreateAssetValidator.cs` | FluentValidation for creating assets. |
| `CreateAssignmentValidator` | class | `AssetManagement.Application/Validators/CreateAssignmentValidator.cs` | FluentValidation for creating assignments. |
| `CreateCategoryValidator` | class | `AssetManagement.Application/Validators/CreateCategoryValidator.cs` | FluentValidation for creating categories. |
| `CreateLocationValidator` | class | `AssetManagement.Application/Validators/CreateLocationValidator.cs` | FluentValidation for creating locations. |
| `CreateUserValidator` | class | `AssetManagement.Application/Validators/CreateUserValidator.cs` | FluentValidation for creating users. |
| `LoginValidator` | class | `AssetManagement.Application/Validators/LoginValidator.cs` | FluentValidation for login. |
| `BusinessException`, `NotFoundException`, `ValidationException` | classes | `AssetManagement.Application/Exceptions` | Application exception types handled by middleware. |

### Domain

| Symbol | Kind | Path | Summary |
|---|---|---|---|
| `BaseEntity` | abstract class | `AssetManagement.Domain/Entities/Common/BaseEntity.cs` | Shared id/timestamps/soft delete fields. |
| `Asset` | class | `AssetManagement.Domain/Entities/Asset.cs` | Managed equipment asset. |
| `Assignment` | class | `AssetManagement.Domain/Entities/Assignment.cs` | Asset-to-user assignment. |
| `AuditLog` | class | `AssetManagement.Domain/Entities/AuditLog.cs` | Audit entry. |
| `Category` | class | `AssetManagement.Domain/Entities/Category.cs` | Asset category. |
| `Location` | class | `AssetManagement.Domain/Entities/Location.cs` | Physical location. |
| `User` | class | `AssetManagement.Domain/Entities/User.cs` | System user. |
| `AssetStatus`, `AssignmentType`, `AuditAction`, `UserRole` | enums | `AssetManagement.Domain/Enums` | Core domain enums mirrored by frontend. |

### Infrastructure

| Symbol | Kind | Path | Summary |
|---|---|---|---|
| `DependencyInjection` | static class | `AssetManagement.Infrastructure/DependencyInjection.cs` | Registers infrastructure services and JWT auth. |
| `ApplicationDbContext` | class | `AssetManagement.Infrastructure/Data/ApplicationDbContext.cs` | EF Core context, DbSets, filters, timestamp behavior. |
| `DataSeeder` | static class | `AssetManagement.Infrastructure/Data/Seed/DataSeeder.cs` | Seeds initial development data. |
| `AssetConfiguration`, `AssignmentConfiguration`, `AuditLogConfiguration`, `CategoryConfiguration`, `LocationConfiguration`, `UserConfiguration` | classes | `AssetManagement.Infrastructure/Data/Configurations` | EF Core entity configuration classes. |
| `AssetRepository`, `AssignmentRepository`, `AuditLogRepository`, `CategoryRepository`, `LocationRepository`, `UserRepository` | classes | `AssetManagement.Infrastructure/Repositories/Implementations` | EF Core repository implementations. |
| `UnitOfWork` | class | `AssetManagement.Infrastructure/Repositories/Implementations/UnitOfWork.cs` | Coordinates repositories, save, and transactions. |
| `JwtSettings` | class | `AssetManagement.Infrastructure/Security/JwtSettings.cs` | JWT config model. |
| `JwtTokenGenerator` | class | `AssetManagement.Infrastructure/Security/JwtTokenGenerator.cs` | Creates JWT tokens. |
| `PasswordHasher` | class | `AssetManagement.Infrastructure/Security/PasswordHasher.cs` | Hashes/verifies passwords. |
| `InitialCreate`, `AddQueryFilters`, `FixSoftDeleteWithCorrectColumnNames`, `FinalSoftDeleteImplementation` | migration classes | `AssetManagement.Infrastructure/Migrations` | EF Core migration history. |

## Frontend Exported Symbols

### App, Routes, Config

| Symbol | Kind | Path | Summary |
|---|---|---|---|
| `App` | component class | `../../Frontend/src/app/app.ts` | Root Angular component. |
| `appConfig` | const | `../../Frontend/src/app/app.config.ts` | Angular providers. |
| `routes` | const | `../../Frontend/src/app/app.routes.ts` and feature `*.routes.ts` | Route definitions. |
| `environment` | const | `../../Frontend/src/environments` | API URL and storage keys. |

### Core Frontend

| Symbol | Kind | Path | Summary |
|---|---|---|---|
| `AuthService`, `StorageService` | services | `../../Frontend/src/app/core/services` | Auth state and browser storage. |
| `BaseApiService`, `AssetService`, `AssignmentService`, `AuditLogService`, `CategoryService`, `LocationService`, `UserService` | services | `../../Frontend/src/app/core/services` | API clients for backend domains. |
| `authGuard`, `roleGuard`, `adminGuard`, `managerGuard`, `employeeGuard` | guard functions | `../../Frontend/src/app/core/guards` | Route protection. |
| `authInterceptor`, `errorInterceptor` | interceptor functions | `../../Frontend/src/app/core/interceptors` | JWT injection and HTTP error handling. |

### Frontend Models

| Symbol | Kind | Path | Summary |
|---|---|---|---|
| `Asset`, `CreateAssetRequest`, `UpdateAssetRequest` | interfaces | `../../Frontend/src/app/core/models/asset.model.ts` | Asset contracts. |
| `Assignment`, `CreateAssignmentRequest` | interfaces | `../../Frontend/src/app/core/models/assignment.model.ts` | Assignment contracts. |
| `AuditLog` | interface | `../../Frontend/src/app/core/models/audit-log.model.ts` | Audit log contract. |
| `Category`, `CreateCategoryRequest`, `UpdateCategoryRequest` | interfaces | `../../Frontend/src/app/core/models/category.model.ts` | Category contracts. |
| `Location`, `CreateLocationRequest`, `UpdateLocationRequest` | interfaces | `../../Frontend/src/app/core/models/location.model.ts` | Location contracts. |
| `User`, `CreateUserRequest`, `UpdateUserRequest`, `LoginRequest`, `LoginResponse` | interfaces | `../../Frontend/src/app/core/models/user.model.ts` | User/auth contracts. |
| `PagedResult<T>`, `ApiError`, `PagedRequest` | interfaces | `../../Frontend/src/app/core/models/common.model.ts` | Common API contracts. |
| `AssetStatus`, `AssignmentType`, `UserRole` | enums | `../../Frontend/src/app/core/models/enums` | Backend enum mirrors. |
| `AssetStatusLabels`, `AssignmentTypeLabels`, `UserRoleLabels` | constants | same | UI labels for enum values. |

### Shared Frontend

| Symbol | Kind | Path | Summary |
|---|---|---|---|
| `LayoutComponent`, `NavbarComponent`, `PageHeaderComponent`, `DataTableComponent`, `ConfirmDialogComponent`, `LoadingSpinnerComponent` | components | `../../Frontend/src/app/shared/components` | Reusable layout and UI components. |
| `HeaderAction`, `Breadcrumb`, `TableColumn`, `TableAction` | interfaces | shared component files | Shared component input contracts. |
| `HasRoleDirective` | directive | `../../Frontend/src/app/shared/directives/has-role.directive.ts` | Role-based conditional rendering. |
| `AssetStatusPipe`, `AssignmentTypePipe`, `UserRolePipe` | pipes | `../../Frontend/src/app/shared/pipes` | Enum display labels. |

### Feature Components

| Symbol | Kind | Path | Summary |
|---|---|---|---|
| `LoginComponent` | component | `../../Frontend/src/app/features/auth/login` | Login form. |
| `DashboardComponent` | component | `../../Frontend/src/app/features/dashboard` | Dashboard screen. |
| `AssetsListComponent`, `AssetFormComponent`, `AssetDetailComponent` | components | `../../Frontend/src/app/features/assets` | Asset list/form/detail. |
| `AssignmentsListComponent`, `AssignmentFormComponent`, `AssignmentDetailComponent` | components | `../../Frontend/src/app/features/assignments` | Assignment list/form/detail. |
| `AuditLogsListComponent` | component | `../../Frontend/src/app/features/audit-logs` | Audit log list. |
| `CategoriesListComponent`, `CategoryFormComponent` | components | `../../Frontend/src/app/features/categories` | Category list/form. |
| `LocationsListComponent`, `LocationFormComponent` | components | `../../Frontend/src/app/features/locations` | Location list/form. |
| `UsersListComponent`, `UserFormComponent`, `UserDetailComponent` | components | `../../Frontend/src/app/features/users` | User list/form/detail. |
| `ForbiddenComponent` | component | `../../Frontend/src/app/features/errors/forbidden` | Forbidden access page. |
