# Technical debt: uploads & attachments

**Status:** Accepted for the current project stage. **Do not refactor** until there is a concrete need (new module, object storage, or policy changes). The existing upload API and task attachment flow must remain stable.

## Context

- `POST /v1/files/upload` and `GET /v1/files/:filename` cover binary storage and public read.
- Task linking uses `TaskAttachmentsService` and `POST /tasks/:id/attachments` (plus completion “after” photos). This is intentional and working.

## Planned improvements (future)

1. **Service-heavy uploads** — Move Multer configuration, MIME/extension checks, size enforcement, and path/URL building from `FilesController` into `FilesService` (or a dedicated upload helper), keeping the controller thin.
2. **Centralized limits & validation** — Single source of truth for max file size (align Multer `limits` with `MAX_FILE_SIZE_MB` / `getMaxFileBytes()`), allowed types, and any future checksum / virus-scan hooks.
3. **Less task-only coupling** — `TaskAttachmentsService` and caps are scoped to `taskId`. The `Attachment` entity already has `entity_type` / `entity_id`; future modules may need shared attachment APIs or a generic service without duplicating persistence logic.
4. **Generic attachment architecture** — When adding non-task owners (e.g. inspections), design explicit `entityType` + `entityId` flows, per-entity caps, and optionally object storage (`storage_provider` / `storage_key`) instead of assuming local disk + task URLs only.

## Stability rule

Refactors should be driven by product requirements and implemented with regression coverage for current field/manager/trade upload and task attachment behavior.
