# BuildPro HQ Core API (NestJS)

Production-style core backend implementation for BuildPro HQ aligned to:

- `../docs/buildprohq_v4.html`
- `../database/schema.sql`
- `../database/er-diagram.md`
- `../database/README.md`

## Implemented Core Scope

- JWT authentication:
  - `POST /api/v1/auth/login`
  - `GET /api/v1/auth/me`
- Role-based access control: manager, field_user, trade_user
- Task APIs:
  - create, open/completed listing, detail
  - update, delete
  - assign/reassign
  - mark complete
  - comment add
  - history retrieval
  - attachment metadata add/retrieve
- User management APIs (manager-only): list/get/create/update
- Lookup APIs:
  - trades, levels
  - task statuses, priorities
  - filter categories/options
- Audit logging hooks for important task/user actions
- Swagger/OpenAPI docs at `/api/docs`

## Security and Platform Baseline

- Helmet + CORS
- Global validation pipe (`whitelist`, `forbidNonWhitelisted`, `transform`)
- JWT guard and centralized role guard
- Sanitized error response filter
- API versioning via `/api/v1`
- DTO-driven request validation

## Deferred to Future Phases

- full push/email notification dispatch workers
- offline sync conflict engine
- runtime geofence enforcement
- scheduled recap/reminder jobs
- full multi-project/site business API rollout

These are intentionally deferred for core scope while keeping architecture extendable.

## Documented technical debt

- **Uploads & attachments:** [docs/TECH_DEBT_UPLOADS_AND_ATTACHMENTS.md](docs/TECH_DEBT_UPLOADS_AND_ATTACHMENTS.md) — accepted trade-offs for this stage; `POST /v1/files/upload` and task attachment flows stay stable until a future refactor is justified.

## Setup

1. Copy env file:

```bash
cp .env.example .env
```

2. Install dependencies:

```bash
npm install
```

3. Configure your database in `.env`.
   - PostgreSQL defaults: `DB_TYPE=postgres`, `DB_PORT=5432`

4. Run migrations to set up the schema:

```bash
npm run migration:run
```

5. Seed core lookup data and test users:

```bash
npm run seed
```

6. Start API in development mode:

```bash
npm run start:dev
```

## Commands Reference

### Development
- `npm run start`: Start the application.
- `npm run start:dev`: Start the application in watch mode.
- `npm run start:debug`: Start the application in debug/watch mode.
- `npm run start:prod`: Start the built application from `dist/`.
- `npm run build`: Build the application.

### Database & Migrations
- `npm run migration:generate --name=MigrationName`: Generate a new migration based on entity changes.
- `npm run migration:run`: Execute all pending migrations.
- `npm run migration:revert`: Revert the last executed migration.
- `npm run migration:show`: Show the status of all migrations.
- `npm run seed`: Seed the database with initial data.
- `npm run typeorm`: Internal command to run TypeORM CLI with the data-source config.

### Code Quality
- `npm run lint`: Lint the codebase and auto-fix issues.
- `npm run format`: Format the code using Prettier.

### Testing
- `npm run test`: Run all unit tests.
- `npm run test:watch`: Run tests in watch mode.
- `npm run test:cov`: Generate test coverage report.
- `npm run test:debug`: Debug unit tests.

## Seeded Test Users

- `manager@buildpro.com` / `Manager@123` (Manager Role)
- `field@buildpro.com` / `Field@123` (Field User Role)
- `trade@buildpro.com` / `Trade@123` (Trade User Role)

## API Documentation

Once the server is running, visit:
- **Swagger UI**: `http://localhost:3001/api/docs`
