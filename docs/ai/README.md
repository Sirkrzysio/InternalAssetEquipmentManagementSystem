# AI Documentation Index

Purpose: give a future AI assistant or developer a fast, reliable map of this project without scanning every file from scratch.

## Reading Order

1. `engineering-standards.md` - mandatory senior/enterprise working rules and anti-AI-slop guardrails.
2. `project-overview.md` - high-level architecture and project shape.
3. `backend-class-map.md` - where each backend class/interface/enum belongs and what it does.
4. `symbol-index.md` - complete symbol inventory for backend and frontend.
5. `api-map.md` - HTTP surface, authorization rules, and controller/service mapping.
6. `backend-implementation-notes.md` - current backend behavior, composition, gaps, and operational risks found in code.
7. `frontend-map.md` - Angular routes, services, models, and feature components.
8. `frontend-implementation-notes.md` - current frontend behavior, service calls, gaps, and risks found in code.
9. `frontend-development-guide.md` - practical frontend conventions for new screens and changes.
10. `deployment-config-notes.md` - environment, secrets, database, CORS, JWT, and deployment configuration notes.
11. `decision-log.md` - lightweight architecture decision records and consequences.
12. `business-flows.md` - login, asset CRUD, assignment, soft delete, restore, cleanup, audit.
13. `maintenance-notes.md` - risks, inconsistencies, and practical next improvements.

## Repository Layout

- `../..` - repository root.
- `../../Backend` - backend solution root.
- `../../Backend/AssetManagement.API` - ASP.NET Core presentation layer.
- `../../Backend/AssetManagement.Application` - use cases, DTOs, validators, service interfaces.
- `../../Backend/AssetManagement.Domain` - entities and enums.
- `../../Backend/AssetManagement.Infrastructure` - EF Core, repositories, security, persistence.
- `../../Frontend` - Angular application.

## Fast Navigation

- Starting any code change? Open `engineering-standards.md` first and treat it as mandatory.
- Need an endpoint? Open `api-map.md`, then the controller in `AssetManagement.API/Controllers`.
- Need business rules? Open `backend-class-map.md`, then the matching service in `AssetManagement.Application/Services`.
- Need the real current backend state? Open `backend-implementation-notes.md`.
- Need a specific class/interface/export? Open `symbol-index.md`.
- Need database shape? Open `backend-class-map.md` sections `Domain` and `Infrastructure/Data`.
- Need UI/API alignment? Open `frontend-map.md` and compare the service endpoint with `api-map.md`.
- Need the real current frontend state? Open `frontend-implementation-notes.md`.
- Need to add or change a frontend feature? Open `frontend-development-guide.md` before editing.
- Need environment/deployment assumptions? Open `deployment-config-notes.md`.
- Need to understand why an architectural choice exists? Open `decision-log.md`.
- Need cleanup/retention behavior? Open `business-flows.md`, then `DataCleanupService`, `DataCleanupBackgroundService`, and repositories.

## Documentation Scope

This documentation is descriptive. It does not change runtime behavior. It lives at repository level because it covers both `Backend` and `Frontend`. Update it when classes, endpoints, frontend routes, environment assumptions, or cross-layer contracts change.
