# BuildPro HQ Migration Guidelines

This document outlines the mandatory standard workflow for all database schema changes in the BuildPro HQ project.

## Core Principles
- **No Synchronize**: `synchronize: true` is strictly prohibited. All schema changes must be driven by versioned migration files.
- **Data Safety First**: Always review generated SQL before running migrations. Never commit a migration that contains accidental `DROP` statements.
- **MySQL Specificity**: Use explicit MySQL-safe types and lengths to ensure consistency across all environments (Dev/Test/Prod).

---

## 🏗 Entity Design Standards (MySQL)

### 1. Primary Keys
- Use `bigint` unsigned: `@PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })`.

### 2. Timestamps
- Use `timestamp(6)` for high precision.
- Extend `SoftDeleteTimestamps` base class for all standard entities.
- Explicitly define `precision: 6` if adding manual timestamp columns.

### 3. String Columns
- Always define a `length`.
- `varchar(50)` for codes/enums.
- `varchar(150)` for names.
- `varchar(255)` for emails/hashes.
- `text` for descriptions/notes.

### 4. Decimals
- Always define `precision` and `scale` (e.g., `precision: 10, scale: 7` for GPS).

### 5. Relations
- Use explicit foreign key columns (e.g., `user_id`) and `@JoinColumn`.
- Define `onDelete` actions (e.g., `CASCADE` for site-related data, `RESTRICT` for lookups).

---

## ⚡ Migration Flow (The 5 Steps)

Follow these steps for any schema change:

### Step 1: Update Entities
Modify your TypeScript entity files. Ensure they follow the Design Standards above.

### Step 2: Generate Migration
Run the following command (replace `MyChanges` with a descriptive PascalCase name):
```bash
npm run migration:generate --name=MyChanges
```

### Step 3: Review Generated Code
Open the new file in `src/infrastructure/persistence/typeorm/migrations/`.
- Verify the SQL is correct.
- Ensure no unexpected tables or columns are being dropped.
- Confirm any manual logic (e.g., data migration) is added to the `up()` method if needed.

### Step 4: Run Migration
Apply the changes to your local database:
```bash
npm run migration:run
```

### Step 5: Verify
Check your database with your preferred SQL tool or `npm run migration:show` to confirm success.

---

## 🚫 Common Pitfalls to Avoid
- ❌ **Never** edit the SQL of an already executed migration. If you made a mistake, use `migration:revert` or create a new incremental migration.
- ❌ **Never** manually change the DB schema via MySQL CLI. The Migrations table must stay in sync with your entities.
- ❌ **Never** commit migrations that were generated with `synchronize: true` accidentally set.
