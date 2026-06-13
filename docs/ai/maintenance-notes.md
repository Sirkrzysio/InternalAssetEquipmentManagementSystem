# Maintenance Notes

These are practical notes for future work. They are not blockers for reading the project, but they identify places where changes need care.

## High-Value Improvements

1. Add backend test projects.
   - Focus first on `AssetService`, `AssignmentService`, `AuthService`, `DataCleanupService`.
   - Add integration tests for controllers and auth/role behavior.

2. Move secrets out of committed config.
   - `appsettings.json` and `appsettings.Development.json` currently contain local DB credentials and a JWT secret.
   - Use user-secrets locally and environment variables in deployment.

3. Tighten CORS.
   - `ServiceExtensions` currently registers `AllowAll`.
   - Prefer configured allowed origins per environment.

4. Make data seeding environment-aware.
   - `DataSeeder` creates a known admin password.
   - Keep this dev-only or require override through configuration.

5. Normalize error handling.
   - Services mostly return `Result`.
   - Exception middleware exists but is not the main business failure path.
   - Consider adding status/error codes to `Result` or using exceptions consistently for use-case failures.

6. Improve audit precision.
   - `AuditLoggingMiddleware` currently uses `Guid.Empty` for entity id.
   - Prefer explicit audit logging in services or route value extraction for entity ids.

7. Keep frontend/backend documentation current.
   - Project files currently target .NET 10 and Angular 21.x.
   - Root README and AI docs should be updated together when runtime versions or startup commands change.

8. Normalize frontend project naming.
   - `Frontend/package.json` uses package name `frondend`.
   - `Frontend/angular.json` uses project name `Frondend`.
   - Renaming is low-risk but should be done deliberately because CLI build targets reference that name.

9. Replace frontend placeholders and client-only filters where they affect correctness.
   - `DashboardComponent` uses static metrics instead of API data.
   - Some list screens page on the server and then apply filters only to the current page.
   - Asset form declares category/location collections but does not currently load them.

10. Modernize frontend async patterns.
   - `AssignmentFormComponent` uses `toPromise()`, which should be replaced with `forkJoin`/`firstValueFrom`.
   - Several components inject `ChangeDetectorRef` and call `detectChanges()` after normal subscriptions; verify whether this is compensating for another issue before copying the pattern.

11. Replace browser `confirm()` flows with the shared confirmation component.
   - `ConfirmDialogComponent` exists, but many destructive/important actions still use native `confirm()`.

12. Harden backend operational defaults.
   - Startup comment says migrations are applied, but current code only calls `DataSeeder.SeedAsync`.
   - CORS uses `AllowAll`.
   - JWT secret and PostgreSQL credentials are committed in appsettings.
   - Seeded admin credentials are deterministic and should be dev-only or externally configured.

13. Improve backend audit and cleanup precision.
   - `AuditLoggingMiddleware` records `Guid.Empty` as entity id and derives entity name from route text.
   - Manual data retention cleanup ignores retention and permanently deletes all soft-deleted records.
   - Cleanup interval is hardcoded to 24 hours in the hosted service.

## Current Security Notes

- JWT secret is hardcoded in configuration.
- Connection string with username/password is committed.
- Local frontend production environment still points to localhost.
- Token storage appears local-storage based; this is common for simple apps but has XSS exposure tradeoffs.

## Current Architecture Strengths

- Clear layer separation.
- Thin controllers.
- Repository and unit-of-work abstractions are consistent.
- DTOs isolate API shape from entity shape.
- Soft delete and retention cleanup are explicit concepts.
- Angular frontend mirrors backend domains cleanly.

## Areas to Inspect Before Editing

- Before changing entity fields: inspect entity, DTOs, AutoMapper profile, EF configuration, migrations, validators, Angular models, Angular forms.
- Before changing enum values: update backend enum, frontend enum, frontend labels/pipes, seeded data if affected.
- Before changing endpoint names: update controller route/action and corresponding Angular service.
- Before changing auth or roles: inspect backend attributes, JWT claims, Angular guards, `HasRoleDirective`, navbar visibility.
- Before changing deletion behavior: inspect query filters, repository delete/restore, cleanup service, frontend list reloads.
- Before changing frontend list filtering: check whether the filter applies server-side, client-side on a single page, or both.
- Before changing startup/config: inspect `Program.cs`, `ServiceExtensions`, `Infrastructure/DependencyInjection`, appsettings, and `deployment-config-notes.md`.

## Generated/High-Churn Files

Avoid manual edits unless necessary:

- `AssetManagement.Infrastructure/Migrations/*.Designer.cs`
- `AssetManagement.Infrastructure/Migrations/ApplicationDbContextModelSnapshot.cs`
- `../../Frontend/package-lock.json`
- build output directories such as `bin`, `obj`, `dist`, `node_modules`.
