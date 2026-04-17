# BuildProHQ Database Review + Improvement Notes

This schema review is based strictly on `docs/buildprohq_v4.html`.

## 1) What was missing or weak before review

- `tasks` lacked a direct `assigned_to` style column used by many operational query patterns.
- `audit_logs` did not follow the requested naming contract (`table_name`, `record_id`, `action_type`, `old_value`, `new_value`, `performed_by`).
- A few FK-heavy tables had room for clearer indexing symmetry on join columns.
- Documentation needed explicit “what changed and why” traceability.

## 2) What was fixed

### Task workflow completeness

- Added `tasks.assigned_to_user_id` to support direct assignment lookup/filtering from UI/API flows.
- Kept `task_assignments` as historical assignment ledger for enterprise traceability.
- Preserved status lookup model (`task_statuses`) to avoid hardcoded status enums.
- Added `task_priorities` lookup and `tasks.priority_id` for production-ready priority control without hardcoded enums.
- Added `task_comments` for collaboration and operational discussion.
- Added `task_history` for explicit status/action traceability.
- Upgraded `task_history` fields to enterprise workflow semantics:
  - `old_status_id`, `new_status_id`
  - `old_assignee_user_id`, `new_assignee_user_id`
  - `changed_by`
  - `change_reason`

### Notification system completeness

- Added `notifications` as a first-class user inbox for operational alerts.
- Supports the required production flows:
  - Task assignment alerts (`type = 'task_assigned'`)
  - Status change notifications (`type = 'status_changed'`)
  - General user notifications (`type = 'general'`)
- `notifications.user_id -> users.id` uses `ON DELETE CASCADE`, so user cleanup automatically removes dependent notifications.
- Added read-state tracking (`is_read`) and polymorphic entity linkage (`entity_type`, `entity_id`) to tie notifications to task records and future entities.
- Added query-focused indexes for inbox performance at scale:
  - `(user_id, is_read)` for unread/read filtering
  - `(entity_type, entity_id)` for entity drill-down and reverse lookup
- Added optional `notification_settings` for per-user preferences (`task_assigned`, `status_changed`, `general`) so delivery can be controlled without changing event generation logic.

Why this was added: assignment and status transitions are core workflow events in BuildProHQ and require durable, queryable user-facing alerts. This model keeps notification delivery reliable, supports unread counters/inbox APIs efficiently, and remains extensible for future entities.

### RBAC completeness

- RBAC remains complete and explicit:
  - `roles`
  - `permissions`
  - `role_permissions`
  - `user_roles`
- All RBAC links keep strict FK integrity and cascade/update behavior.

### Audit log contract alignment

- Updated `audit_logs` to include required business fields:
  - `id`
  - `table_name`
  - `record_id`
  - `action_type` (`CREATE`, `UPDATE`, `DELETE`)
  - `old_value` (JSON)
  - `new_value` (JSON)
  - `performed_by` (user id)
  - `created_at`
- Retained additional enterprise-useful columns (`ip_address`, `request_id`, `user_agent`, `updated_at`, `deleted_at`) without breaking the required contract.
- Added dedicated indexes for `table_name`, `record_id`, and `performed_by` to improve audit investigations.

### Optional extensibility fields (targeted, not blanket)

Added only where business workflows justify future variability:

- `tasks`
  - `notes TEXT NULL`
  - `metadata JSON NULL`
- `task_assignments`
  - `notes TEXT NULL`
  - `metadata JSON NULL`
- `task_completions`
  - `notes TEXT NULL`
  - `metadata JSON NULL`
- `task_comments`
  - `metadata JSON NULL`
- `task_history`
  - `description TEXT NULL`
  - `notes TEXT NULL`
  - `metadata JSON NULL`

Why: these tables are high-change transactional records where new UI inputs/integrations frequently introduce additional fields. JSON metadata prevents disruptive migrations for small additive attributes while core relational columns remain normalized.

### Image / file upload support (final pass)

Based on docs and flow notes (completion photo prompt, photo/video evidence, cloud upload, time/GPS capture), a dedicated `attachments` table was added:

- Generic reference support:
  - `entity_type`, `entity_id` for future entities (task/project/listing)
- Strong task workflow support:
  - `task_id` FK to `tasks` with `ON DELETE CASCADE`
- File validation/storage fields:
  - `file_url`, `file_name`, `file_type`, `mime_type`, `file_size`
- Upload provenance:
  - `uploaded_by` (FK to `users`)
- Evidence semantics:
  - `is_before`, `is_after`, `captured_at`, `captured_lat`, `captured_lng`
- Flexibility:
  - `metadata JSON` for provider/object-storage specific attributes

This design keeps structured columns for core file properties and uses JSON only for non-uniform optional attributes.

## 3) Audit column logic (conditional policy)

Required conditional columns:

- `created_by BIGINT UNSIGNED NULL`
- `updated_by BIGINT UNSIGNED NULL`
- `ip_address VARCHAR(45) NULL`

### Added to user-driven / transactional tables

- `users`
- `user_roles`
- `user_invitations`
- `tasks`
- `task_assignments`
- `task_completions`
- `task_filters` (dynamic filter selections applied to tasks)
- `task_comments`
- `task_history`
- `attachments`

### Intentionally excluded from lookup/static/system tables

- Lookup/master tables:
  - `user_types`, `user_statuses`, `task_statuses`, `invitation_statuses`,
    `roles`, `permissions`, `filters`, `sub_filters`
- Non-critical system mapping/config:
  - `role_permissions`, `settings`

Rationale: actor-level auditing here provides low business value relative to write overhead; full change trail can still be persisted in `audit_logs`.

## 4) Normalization and relationship quality

- 3NF+ maintained:
  - No hardcoded business enums in transactional tables.
  - Status/priority/type/filter metadata normalized into dedicated tables.
  - Many-to-many relationships represented via junction tables (`user_roles`, `role_permissions`, `task_filters`, `filter_projects`).
- Referential integrity enforced via explicit FKs and clear delete/update actions.

## 5) Index and query-path improvements

- Added/confirmed indexes for:
  - All FK columns.
  - `tasks.assigned_to_user_id`, `tasks.status_id`, creator/audit columns.
  - Composite production paths:
    - `tasks(assigned_to_user_id, status_id, deleted_at)`
    - `tasks(assigned_to_user_id, status_id, priority_id, deleted_at)`
    - `tasks(created_by_user_id, status_id, deleted_at)`
    - `tasks(created_by, created_at)`
    - `task_assignments(assignee_user_id, assigned_at, deleted_at)`
    - `task_assignments(created_by, created_at)`
    - `task_completions(completed_by_user_id, completed_at)`
    - `task_completions(created_by, created_at)`
    - `task_comments(task_id, created_at)`
    - `task_history(task_id, changed_at)`
    - `attachments(entity_type, entity_id)`
    - `attachments(uploaded_by)`
    - `attachments(created_by, created_at)`
  - Assignment and completion query paths.
  - Audit log lookup paths (`table_name + record_id`, action, performer, timestamp).
- Full-text index kept on `tasks.description` for scalable search.

## 6) Foreign key strategy (CASCADE vs SET NULL)

- `ON DELETE SET NULL` for user-linked ownership/actor columns where business records must survive user removal:
  - `tasks.created_by_user_id`, `tasks.assigned_to_user_id`
  - `task_history.changed_by`
  - `created_by` / `updated_by` columns
- `ON DELETE CASCADE` for true dependent child records:
  - `task_comments` -> `tasks`
  - `task_history` -> `tasks`
  - `task_assignments` -> `tasks`
  - `task_filters` -> `tasks`
  - `attachments` -> `tasks`
- `ON DELETE RESTRICT` for lookup integrity where deleting master data would break historical semantics:
  - examples: statuses/roles/permissions where applicable.
- `ON UPDATE CASCADE` is consistently applied across foreign keys.

## 7) Scalability decisions

- Suitable for large OLTP workloads with soft-deletes and indexed FK graph.
- Partition recommendations:
  - `audit_logs`: monthly range partition on `created_at`.
  - `tasks`: optional partition by `opened_at` when task volume reaches high tens of millions.
- Prefer keyset pagination for large result sets in task and audit endpoints.

## 8) Source-mapped assumptions (explicit)

- “Action Items” from docs are modeled as `tasks`.
- Task completion in UI maps to:
  - status transition (`task_statuses`), and
  - completion facts (`task_completions`).
- Task comments/history are included as production hardening for multi-user collaboration and forensics, while remaining fully compatible with current docs behavior.
- Field User and Trade User are represented through `user_types`.
- Field User and Trade User are represented through `user_types`.
- Dynamic filter management in UI maps to `filters` + `sub_filters` + `filter_projects` + `task_filters`.

## 9) Requirement-to-DB mapping (production pass)

| Requirement | Table(s) | Status |
|---|---|---|
| User roles (Field, Trade, Manager) | `users`, `user_types`, `roles`, `user_roles`, `permissions`, `role_permissions` | Covered |
| Task lifecycle (open/assigned/completed/deleted/history) | `tasks`, `task_statuses`, `task_assignments`, `task_completions`, `task_history`, `task_comments` | Covered |
| Filters and search | `filters`, `sub_filters`, `filter_projects`, `task_filters`, `tasks` (FTS + indexes) | Covered |
| Manager dashboard data paths | `tasks`, `task_completions`, `users`, `task_metrics` | Covered |
| Assignment acceptance / rejection | `assignment_statuses`, `task_assignments`, `task_assignment_responses` | Covered |
| Completion tracking (who/when/duration) | `task_completions`, `task_history` | Covered |
| Notifications (in-app + preference) | `notifications`, `notification_settings` | Covered |
| Notifications push/email engine | `notification_channels`, `notification_templates`, `user_device_tokens`, `scheduled_notifications`, `notification_logs`, `notification_setting_channels` | Covered |
| Attachments + metadata + before/after + annotation | `attachments` | Covered |
| Audit/history | `audit_logs`, `task_history` | Covered |
| User management + invitations | `users`, `user_statuses`, `user_invitations`, `invitation_statuses` | Covered |
| Filter management | `filters`, `sub_filters`, `filter_projects` | Covered |
| Multi-project/site | `projects`, `sites`, `site_users`, `tasks.project_id`, `tasks.site_id` | Covered |
| Geofencing/site location | `site_locations` (`allowed_radius_meters`) | Covered |
| Offline sync | `device_sync_states`, `sync_logs`, `change_queue` | Covered |
| Analytics/reporting | `task_metrics`, `export_jobs` | Covered |
| SLA/overdue tracking | `tasks.due_at` + query/index path + `days_open` | Covered |

## 10) Gap analysis resolved

- Assignment workflow gap resolved by introducing explicit assignment statuses and response events.
- Notification system expanded from inbox-only to full delivery stack (channels, templates, scheduling, logs, device tokens).
- Multi-project/site and geofence data model added with non-breaking nullable task references.
- Offline synchronization primitives added for mobile/low-connectivity roadmap support.
- Analytics/export readiness added via summary fact table and async export job tracker.
- Attachment model strengthened with storage/checksum/annotation metadata for richer evidence workflows.

## 11) Extension design notes

- Existing tables were preserved; all additions are additive and backward compatible.
- New lookup-driven design avoids hardcoded enums in transactional tables.
- Foreign keys preserve consistency while using `SET NULL` for survivable ownership and `CASCADE` for dependent child rows.
- Composite indexes prioritize critical read paths: inbox/unread, assignment states, due-date backlog, sync workers, and metrics slicing.

## 12) Operational scalability notes

- Keep OLTP tables row-oriented and normalized; use `task_metrics` for dashboard aggregation offloading.
- Consider monthly partitioning for `audit_logs`, `notification_logs`, and `sync_logs` at high volume.
- Prefer keyset pagination for task feeds and notification inboxes.
- Run async workers for `scheduled_notifications`, `notification_logs`, `change_queue`, and `export_jobs`.
