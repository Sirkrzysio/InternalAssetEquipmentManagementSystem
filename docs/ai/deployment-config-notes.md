# Deployment and Configuration Notes

Purpose: document environment assumptions and hardening requirements before running this system outside local development.

## Current Local Defaults

Backend:

- API project: `../../Backend/AssetManagement.API`.
- Local API URL: `http://localhost:5235` based on existing docs and frontend environment.
- PostgreSQL database: `AssetManagementDB`.
- Committed local credentials: `postgres/postgres`.
- JWT issuer: `AssetManagement.API`.
- JWT audience: `AssetManagement.Client`.
- JWT expiry: 60 minutes.
- Swagger is enabled only in development and served at the root route.

Frontend:

- App root: `../../Frontend`.
- Local frontend URL: `http://localhost:4200`.
- `environment.ts` API URL: `http://localhost:5235/api`.
- `environment.prod.ts` is documented as also pointing to localhost; verify before deployment.
- Token storage key: `asset_mgmt_token`.
- User storage key: `asset_mgmt_user`.

## Required Environment Variables or Secret Sources

Do not use committed secrets in shared, staging, or production environments.

Move these values to environment variables, user-secrets, or a secret manager:

- `ConnectionStrings__DefaultConnection`
- `JwtSettings__Secret`
- `JwtSettings__Issuer`
- `JwtSettings__Audience`
- `JwtSettings__ExpirationInMinutes`
- `DataRetention__CategoriesRetentionHours`
- `DataRetention__LocationsRetentionHours`
- `DataRetention__UsersRetentionDays`
- `DataRetention__AssetsRetentionDays`
- `DataRetention__AuditLogsRetentionHours`
- frontend production API URL

JWT secret must be long, random, environment-specific, and rotated through an intentional process.

## Database and Migrations

Current startup seeds data but does not apply migrations.

Deployment must explicitly choose one migration strategy:

- Run migrations as a controlled deployment step before starting the API.
- Or add startup migrations with safeguards, logging, and environment checks.

Do not assume `Program.cs` migrates the database. It currently calls `DataSeeder.SeedAsync` only.

## Seeding Policy

`DataSeeder` creates a known admin account and sample data when no users exist:

- email: `admin@assetmanagement.local`
- password: `Admin123!`

Production-safe options:

- disable seeding outside development
- require seed admin credentials from environment variables
- run one-time bootstrap through an operational script
- force password rotation on first login

Do not deploy deterministic credentials to an environment reachable by other users.

## CORS

Current API CORS policy is `AllowAll`:

- any origin
- any method
- any header

For staging/production, replace this with environment-configured frontend origins, for example:

- local: `http://localhost:4200`
- staging: staging frontend URL
- production: production frontend URL

Keep CORS configuration in backend settings, not hardcoded in code.

## JWT and Logout

JWT bearer validation checks issuer, audience, lifetime, and signing key.

Current logout is client-side only. Existing tokens remain valid until expiry. For stricter environments, consider:

- shorter access-token lifetime
- refresh tokens with rotation
- token blacklist/revocation store
- security stamp or user token version claim

Any token model change must update backend auth, frontend storage, interceptors, and logout behavior together.

## Data Retention

Retention defaults in `appsettings.json`:

- categories: 24 hours
- locations: 24 hours
- users: 30 days
- assets: 90 days
- audit logs: 1 hour

The hosted cleanup service runs every 24 hours after a successful execution. Manual cleanup via Admin endpoint ignores retention and should be treated as destructive maintenance.

Before enabling in production:

- confirm retention periods with business/legal requirements
- review audit log retention, because 1 hour may be too short for compliance
- restrict manual cleanup access and operational usage
- log cleanup executions centrally

## Frontend Deployment

Before building frontend for a non-local environment:

- replace localhost API URL in production environment config
- confirm HTTPS API URL
- confirm CORS allows the deployed frontend origin
- verify JWT issuer/audience match backend settings
- run `npm run build` from `../../Frontend`

Do not hardcode environment URLs in components or services. Use `environment`.

## Operational Checklist

Before shared deployment:

- Secrets are not committed and are provided by environment/secret manager.
- Database migrations have a clear execution path.
- Seed admin is disabled or configured securely.
- CORS allows only expected frontend origins.
- JWT secret/issuer/audience are environment-specific.
- Frontend production API URL is correct.
- HTTPS is configured at host/proxy level.
- Logs are collected outside process stdout when required.
- Retention cleanup behavior is accepted by the business.
- Swagger exposure is intentional for the environment.
