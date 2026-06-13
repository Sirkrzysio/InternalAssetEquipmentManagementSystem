# Project Overview

## System Purpose

Internal Asset Equipment Management System manages company equipment, users, categories, locations, assignments, audit logs, and retention cleanup. It has:

- ASP.NET Core backend with a layered architecture.
- PostgreSQL persistence through Entity Framework Core.
- JWT authentication and role-based authorization.
- Angular frontend in `../../Frontend`.

## Backend Architecture

The backend follows a pragmatic Clean Architecture style:

- `AssetManagement.Domain` contains business entities and enums. It has no infrastructure dependencies.
- `AssetManagement.Application` contains DTOs, validators, service interfaces, repository interfaces, mappings, and application services.
- `AssetManagement.Infrastructure` implements persistence, repositories, JWT/password security, EF Core configuration, migrations, and data seeding.
- `AssetManagement.API` exposes HTTP controllers, middleware, filters, background services, and startup composition.

Primary dependency direction:

`API -> Application -> Domain`

`Infrastructure -> Application + Domain`

`API -> Infrastructure` only for dependency injection and runtime composition.

## Runtime Composition

Entry point: `AssetManagement.API/Program.cs`.

Startup flow:

1. Register infrastructure services with `AddInfrastructure`.
2. Register application services with `AddApplication`.
3. Register API services with `AddApiServices`.
4. Bind `DataRetentionOptions`.
5. Register `DataCleanupBackgroundService`.
6. Configure authorization.
7. Build app.
8. Enable Swagger in development.
9. Add middleware: exception handling, CORS, HTTPS redirect, authentication, authorization, audit logging.
10. Map controllers.
11. Seed database with `DataSeeder.SeedAsync`.

Important note: the current startup seeds data but does not explicitly call `Database.MigrateAsync()`.

## Backend Technology

- Target framework: `.NET 10.0` from `global.json` SDK `10.0.100`.
- EF Core provider: PostgreSQL through `Npgsql.EntityFrameworkCore.PostgreSQL`.
- Authentication: JWT Bearer.
- Mapping: AutoMapper.
- Validation: FluentValidation.
- API docs: Swashbuckle Swagger.

## Frontend Architecture

Frontend is an Angular app in `../../Frontend`.

Main structure:

- `src/app/core` - singleton services, guards, interceptors, models.
- `src/app/shared` - reusable components, directives, pipes.
- `src/app/features` - lazy-loaded business features.

Top-level routing is in `../../Frontend/src/app/app.routes.ts`.

## Main Domains

- Users: identity data, roles, active/deleted state.
- Assets: tracked equipment with category, location, serial number, status, purchase/warranty data.
- Assignments: assigning assets to users and returning them.
- Categories: asset grouping.
- Locations: physical placement.
- Audit logs: action history.
- Retention cleanup: permanent removal of soft-deleted records after configured retention periods.

## Current Operational Assumptions

- Backend API default local URL is `http://localhost:5235`.
- Frontend environment points to `http://localhost:5235/api`.
- PostgreSQL default local credentials appear in appsettings files.
- Seeded admin account is `admin@assetmanagement.local` with password `Admin123!`.

These assumptions are useful for local development but should not be treated as production-safe.
