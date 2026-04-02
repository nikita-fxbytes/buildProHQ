# BuildProHQ ER Diagram (Text)

## Core User + RBAC Structure

- `user_types` 1 --- N `users`
- `user_statuses` 1 --- N `users`
- `users` 1 --- 0..1 `user_trade_profiles`
- `trades` 1 --- N `user_trade_profiles`
- `users` N --- M `roles` via `user_roles`
- `roles` N --- M `permissions` via `role_permissions`
- `invitation_statuses` 1 --- N `user_invitations`
- `users` 1 --- N `user_invitations` (invited user and inviter)

## Task / Issue Workflow (Primary Business Flow)

- `projects` 1 --- N `sites`
- `sites` N --- M `users` via `site_users`
- `sites` 1 --- N `site_locations` (geofence coordinates and allowed radius)
- `task_statuses` 1 --- N `tasks`
- `task_priorities` 1 --- N `tasks`
- `levels` 1 --- N `tasks`
- `trades` 1 --- N `tasks`
- `projects` 1 --- N `tasks` (optional project scoping via `project_id`)
- `sites` 1 --- N `tasks` (optional site scoping via `site_id`)
- `users` 1 --- N `tasks` (creator via `created_by_user_id`)
- `users` 1 --- N `tasks` (current assignee via `assigned_to_user_id`)
- `assignment_statuses` 1 --- N `task_assignments` (pending/accepted/rejected lifecycle)
- `tasks` 1 --- N `task_assignments` (assignment history)
- `users` 1 --- N `task_assignments` (assignee via `assignee_user_id`)
- `users` 1 --- N `task_assignments` (assigner via `assigned_by_user_id`)
- `task_assignments` 1 --- N `task_assignment_responses` (accept/reject response trail)
- `tasks` 1 --- 0..1 `task_completions`
- `users` 1 --- N `task_completions` (completer via `completed_by_user_id`)
- `tasks` 1 --- N `task_comments` (discussion stream)
- `users` 1 --- N `task_comments` (comment author via `created_by`)
- `tasks` 1 --- N `task_history` (state transition and action trail)
- `task_statuses` 1 --- N `task_history` (old_status_id / new_status_id)
- `users` 1 --- N `task_history` (reassignment old/new assignee + actor via `changed_by`)
- `users` 1 --- N `notifications` (recipient via `user_id`)
- `users` 1 --- 0..1 `notification_settings` (per-user notification preferences)
- `notification_channels` 1 --- N `notifications`
- `notification_templates` 1 --- N `notifications`
- `users` N --- M `notification_channels` via `notification_setting_channels`
- `users` 1 --- N `user_device_tokens`
- `notifications` 1 --- N `notification_logs`
- `scheduled_notifications` 1 --- N `notification_logs`
- `tasks` 1 --- N `attachments` (photo/video evidence via `task_id`)
- `users` 1 --- N `attachments` (uploader via `uploaded_by`)

## Dynamic Filter Model

- `filter_categories` 1 --- N `filter_options`
- `tasks` N --- M `filter_options` via `task_filter_values`

## Configuration + Audit

- `settings` scoped by `(scope_type, scope_id)` for global/module/role/user config.
- `users` 1 --- N `audit_logs` (performer via `performed_by`).
- `users` 1 --- N `sync_logs` and `device_sync_states` (offline synchronization state and history).
- `change_queue` stores entity-level delta events for offline replay and conflict handling.
- `task_metrics` stores pre-aggregated analytics by date/project/site/trade/level.
- `export_jobs` tracks async reporting/export requests and delivery status.

## Key Business Flows Covered

1. User created/invited (`users`, `user_invitations`) and linked to user type/status.
2. Role assignment and RBAC enforcement (`user_roles`, `roles`, `permissions`, `role_permissions`).
3. Task created with status (`tasks.status_id`), creator (`created_by_user_id`), and optional direct assignee (`assigned_to_user_id`).
4. Task priority managed through lookup (`tasks.priority_id -> task_priorities`).
5. Assignment changes tracked in detail (`task_assignments` history).
6. Completion captured once per task (`task_completions`) with who completed and duration.
7. Task collaboration captured via comments (`task_comments`) and status/action history (`task_history`).
8. `task_history` captures old/new status, old/new assignee, actor (`changed_by`), reason, and change timestamp.
9. User notifications support assignment/status/general alerts (`notifications`) with optional task linkage (`entity_type`, `entity_id`) and read state.
10. User-level notification delivery preferences are stored in `notification_settings`.
11. Notification delivery stack supports channel routing, templates, scheduling, and delivery observability (`notification_channels`, `notification_templates`, `scheduled_notifications`, `notification_logs`, `user_device_tokens`).
12. Assignment response lifecycle is traceable via status lookup and response table (`assignment_statuses`, `task_assignment_responses`).
13. Multi-project and site-level operations are modeled (`projects`, `sites`, `site_users`, `site_locations`) with geofence radius controls.
14. Image/video upload evidence stored in `attachments` with file metadata, uploader, before/after flags, annotation JSON, and capture GPS/time fields.
15. Filtering supported by dynamic metadata (`filter_categories`, `filter_options`, `task_filter_values`).
16. Data-change traceability captured in `audit_logs` (CREATE/UPDATE/DELETE payloads).
17. Offline sync and analytics/reporting are covered through `device_sync_states`, `sync_logs`, `change_queue`, `task_metrics`, and `export_jobs`.

## RBAC + Task Access Read Path

- User authentication resolves to `users`.
- Authorization resolves through `user_roles -> roles -> role_permissions -> permissions`.
- Task access/query commonly filters by:
  - `tasks.assigned_to_user_id` + `tasks.status_id`
  - `tasks.created_by_user_id` + `tasks.status_id`
  - assignment history in `task_assignments`
