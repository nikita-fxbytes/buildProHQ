-- BuildProHQ enterprise schema
-- Source of truth: docs/buildprohq_v4.html
-- Target: MySQL 8+, InnoDB, utf8mb4

SET NAMES utf8mb4;
SET time_zone = '+00:00';

-- =====================================================
-- LOOKUP / MASTER TABLES (no created_by/updated_by/ip_address)
-- =====================================================

CREATE TABLE IF NOT EXISTS user_types (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  code VARCHAR(50) NOT NULL,
  name VARCHAR(100) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP NULL,
  UNIQUE KEY uq_user_types_code (code),
  UNIQUE KEY uq_user_types_name (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS user_statuses (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  code VARCHAR(50) NOT NULL,
  name VARCHAR(100) NOT NULL,
  is_active TINYINT(1) NOT NULL DEFAULT 1,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP NULL,
  UNIQUE KEY uq_user_statuses_code (code)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS task_statuses (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  code VARCHAR(50) NOT NULL,
  name VARCHAR(100) NOT NULL,
  is_terminal TINYINT(1) NOT NULL DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP NULL,
  UNIQUE KEY uq_task_statuses_code (code)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS task_priorities (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  code VARCHAR(50) NOT NULL,
  name VARCHAR(100) NOT NULL,
  sort_order INT UNSIGNED NOT NULL DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP NULL,
  UNIQUE KEY uq_task_priorities_code (code),
  UNIQUE KEY uq_task_priorities_name (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS invitation_statuses (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  code VARCHAR(50) NOT NULL,
  name VARCHAR(100) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP NULL,
  UNIQUE KEY uq_invitation_statuses_code (code)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS trades (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  code VARCHAR(50) NOT NULL,
  name VARCHAR(100) NOT NULL,
  sort_order INT UNSIGNED NOT NULL DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP NULL,
  UNIQUE KEY uq_trades_code (code),
  UNIQUE KEY uq_trades_name (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS levels (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  code VARCHAR(50) NOT NULL,
  name VARCHAR(100) NOT NULL,
  sort_order INT UNSIGNED NOT NULL DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP NULL,
  UNIQUE KEY uq_levels_code (code),
  UNIQUE KEY uq_levels_name (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS roles (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  code VARCHAR(50) NOT NULL,
  name VARCHAR(100) NOT NULL,
  is_system_role TINYINT(1) NOT NULL DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP NULL,
  UNIQUE KEY uq_roles_code (code),
  UNIQUE KEY uq_roles_name (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS permissions (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  code VARCHAR(100) NOT NULL,
  name VARCHAR(150) NOT NULL,
  module_key VARCHAR(100) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP NULL,
  UNIQUE KEY uq_permissions_code (code),
  UNIQUE KEY uq_permissions_name (name),
  KEY idx_permissions_module_key (module_key)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS filter_categories (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  code VARCHAR(50) NOT NULL,
  name VARCHAR(100) NOT NULL,
  is_system_category TINYINT(1) NOT NULL DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP NULL,
  UNIQUE KEY uq_filter_categories_code (code),
  UNIQUE KEY uq_filter_categories_name (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS filter_options (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  filter_category_id BIGINT UNSIGNED NOT NULL,
  code VARCHAR(50) NOT NULL,
  name VARCHAR(100) NOT NULL,
  sort_order INT UNSIGNED NOT NULL DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP NULL,
  UNIQUE KEY uq_filter_options_category_code (filter_category_id, code),
  UNIQUE KEY uq_filter_options_category_name (filter_category_id, name),
  KEY idx_filter_options_filter_category_id (filter_category_id),
  CONSTRAINT fk_filter_options_filter_category_id
    FOREIGN KEY (filter_category_id) REFERENCES filter_categories(id)
    ON DELETE CASCADE
    ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS settings (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  scope_type VARCHAR(30) NOT NULL DEFAULT 'global',
  scope_id BIGINT UNSIGNED NULL,
  setting_key VARCHAR(120) NOT NULL,
  setting_value_json JSON NOT NULL,
  is_sensitive TINYINT(1) NOT NULL DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP NULL,
  UNIQUE KEY uq_settings_scope_key (scope_type, scope_id, setting_key),
  KEY idx_settings_scope (scope_type, scope_id),
  KEY idx_settings_setting_key (setting_key),
  CONSTRAINT chk_settings_scope_type CHECK (scope_type IN ('global', 'module', 'role', 'user'))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- USER / SECURITY / RBAC (audited where user action is critical)
-- =====================================================

CREATE TABLE IF NOT EXISTS users (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_type_id BIGINT UNSIGNED NOT NULL,
  user_status_id BIGINT UNSIGNED NOT NULL,
  full_name VARCHAR(150) NOT NULL,
  initials VARCHAR(8) NULL,
  email VARCHAR(255) NOT NULL,
  password_hash VARCHAR(255) NULL,
  last_login_at TIMESTAMP NULL,
  -- Conditional audit columns
  created_by BIGINT UNSIGNED NULL,
  updated_by BIGINT UNSIGNED NULL,
  ip_address VARCHAR(45) NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP NULL,
  UNIQUE KEY uq_users_email (email),
  KEY idx_users_user_type_id (user_type_id),
  KEY idx_users_user_status_id (user_status_id),
  KEY idx_users_created_by (created_by),
  KEY idx_users_updated_by (updated_by),
  KEY idx_users_deleted_at (deleted_at),
  CONSTRAINT fk_users_user_type_id
    FOREIGN KEY (user_type_id) REFERENCES user_types(id)
    ON DELETE RESTRICT
    ON UPDATE CASCADE,
  CONSTRAINT fk_users_user_status_id
    FOREIGN KEY (user_status_id) REFERENCES user_statuses(id)
    ON DELETE RESTRICT
    ON UPDATE CASCADE,
  CONSTRAINT fk_users_created_by
    FOREIGN KEY (created_by) REFERENCES users(id)
    ON DELETE SET NULL
    ON UPDATE CASCADE,
  CONSTRAINT fk_users_updated_by
    FOREIGN KEY (updated_by) REFERENCES users(id)
    ON DELETE SET NULL
    ON UPDATE CASCADE,
  CONSTRAINT chk_users_full_name_not_blank CHECK (CHAR_LENGTH(TRIM(full_name)) > 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS user_trade_profiles (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id BIGINT UNSIGNED NOT NULL,
  trade_id BIGINT UNSIGNED NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP NULL,
  UNIQUE KEY uq_user_trade_profiles_user_id (user_id),
  KEY idx_user_trade_profiles_trade_id (trade_id),
  CONSTRAINT fk_user_trade_profiles_user_id
    FOREIGN KEY (user_id) REFERENCES users(id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT fk_user_trade_profiles_trade_id
    FOREIGN KEY (trade_id) REFERENCES trades(id)
    ON DELETE RESTRICT
    ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS role_permissions (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  role_id BIGINT UNSIGNED NOT NULL,
  permission_id BIGINT UNSIGNED NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP NULL,
  UNIQUE KEY uq_role_permissions_role_perm (role_id, permission_id),
  KEY idx_role_permissions_permission_id (permission_id),
  CONSTRAINT fk_role_permissions_role_id
    FOREIGN KEY (role_id) REFERENCES roles(id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT fk_role_permissions_permission_id
    FOREIGN KEY (permission_id) REFERENCES permissions(id)
    ON DELETE CASCADE
    ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS user_roles (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id BIGINT UNSIGNED NOT NULL,
  role_id BIGINT UNSIGNED NOT NULL,
  -- Conditional audit columns (who assigned or changed RBAC)
  created_by BIGINT UNSIGNED NULL,
  updated_by BIGINT UNSIGNED NULL,
  ip_address VARCHAR(45) NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP NULL,
  UNIQUE KEY uq_user_roles_user_role (user_id, role_id),
  KEY idx_user_roles_role_id (role_id),
  KEY idx_user_roles_created_by (created_by),
  KEY idx_user_roles_updated_by (updated_by),
  CONSTRAINT fk_user_roles_user_id
    FOREIGN KEY (user_id) REFERENCES users(id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT fk_user_roles_role_id
    FOREIGN KEY (role_id) REFERENCES roles(id)
    ON DELETE RESTRICT
    ON UPDATE CASCADE,
  CONSTRAINT fk_user_roles_created_by
    FOREIGN KEY (created_by) REFERENCES users(id)
    ON DELETE SET NULL
    ON UPDATE CASCADE,
  CONSTRAINT fk_user_roles_updated_by
    FOREIGN KEY (updated_by) REFERENCES users(id)
    ON DELETE SET NULL
    ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS user_invitations (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  invited_user_id BIGINT UNSIGNED NULL,
  invited_email VARCHAR(255) NOT NULL,
  invitation_status_id BIGINT UNSIGNED NOT NULL,
  token_hash VARCHAR(255) NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  accepted_at TIMESTAMP NULL,
  invited_by_user_id BIGINT UNSIGNED NULL,
  -- Conditional audit columns
  created_by BIGINT UNSIGNED NULL,
  updated_by BIGINT UNSIGNED NULL,
  ip_address VARCHAR(45) NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP NULL,
  KEY idx_user_invitations_invited_email (invited_email),
  KEY idx_user_invitations_expires_at (expires_at),
  KEY idx_user_invitations_invited_user_id (invited_user_id),
  KEY idx_user_invitations_invited_by_user_id (invited_by_user_id),
  KEY idx_user_invitations_created_by (created_by),
  KEY idx_user_invitations_updated_by (updated_by),
  CONSTRAINT fk_user_invitations_invited_user_id
    FOREIGN KEY (invited_user_id) REFERENCES users(id)
    ON DELETE SET NULL
    ON UPDATE CASCADE,
  CONSTRAINT fk_user_invitations_status_id
    FOREIGN KEY (invitation_status_id) REFERENCES invitation_statuses(id)
    ON DELETE RESTRICT
    ON UPDATE CASCADE,
  CONSTRAINT fk_user_invitations_invited_by_user_id
    FOREIGN KEY (invited_by_user_id) REFERENCES users(id)
    ON DELETE SET NULL
    ON UPDATE CASCADE,
  CONSTRAINT fk_user_invitations_created_by
    FOREIGN KEY (created_by) REFERENCES users(id)
    ON DELETE SET NULL
    ON UPDATE CASCADE,
  CONSTRAINT fk_user_invitations_updated_by
    FOREIGN KEY (updated_by) REFERENCES users(id)
    ON DELETE SET NULL
    ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- PROJECT / SITE ORGANIZATION (multi-project + geofence-ready)
-- =====================================================

CREATE TABLE IF NOT EXISTS projects (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  code VARCHAR(50) NOT NULL,
  name VARCHAR(150) NOT NULL,
  description TEXT NULL,
  project_status VARCHAR(30) NOT NULL DEFAULT 'active',
  start_date DATE NULL,
  end_date DATE NULL,
  -- Conditional audit columns
  created_by BIGINT UNSIGNED NULL,
  updated_by BIGINT UNSIGNED NULL,
  ip_address VARCHAR(45) NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP NULL,
  UNIQUE KEY uq_projects_code (code),
  KEY idx_projects_project_status (project_status),
  KEY idx_projects_created_by (created_by),
  KEY idx_projects_updated_by (updated_by),
  KEY idx_projects_deleted_at (deleted_at),
  CONSTRAINT fk_projects_created_by
    FOREIGN KEY (created_by) REFERENCES users(id)
    ON DELETE SET NULL
    ON UPDATE CASCADE,
  CONSTRAINT fk_projects_updated_by
    FOREIGN KEY (updated_by) REFERENCES users(id)
    ON DELETE SET NULL
    ON UPDATE CASCADE,
  CONSTRAINT chk_projects_name_not_blank CHECK (CHAR_LENGTH(TRIM(name)) > 0),
  CONSTRAINT chk_projects_status CHECK (project_status IN ('active', 'on_hold', 'completed', 'cancelled'))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS sites (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  project_id BIGINT UNSIGNED NOT NULL,
  code VARCHAR(50) NOT NULL,
  name VARCHAR(150) NOT NULL,
  address_line_1 VARCHAR(255) NULL,
  address_line_2 VARCHAR(255) NULL,
  suburb VARCHAR(120) NULL,
  state VARCHAR(120) NULL,
  postal_code VARCHAR(30) NULL,
  country_code CHAR(2) NULL,
  timezone VARCHAR(80) NOT NULL DEFAULT 'UTC',
  is_active TINYINT(1) NOT NULL DEFAULT 1,
  -- Conditional audit columns
  created_by BIGINT UNSIGNED NULL,
  updated_by BIGINT UNSIGNED NULL,
  ip_address VARCHAR(45) NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP NULL,
  UNIQUE KEY uq_sites_project_code (project_id, code),
  KEY idx_sites_project_id (project_id),
  KEY idx_sites_is_active (is_active),
  KEY idx_sites_created_by (created_by),
  KEY idx_sites_updated_by (updated_by),
  CONSTRAINT fk_sites_project_id
    FOREIGN KEY (project_id) REFERENCES projects(id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT fk_sites_created_by
    FOREIGN KEY (created_by) REFERENCES users(id)
    ON DELETE SET NULL
    ON UPDATE CASCADE,
  CONSTRAINT fk_sites_updated_by
    FOREIGN KEY (updated_by) REFERENCES users(id)
    ON DELETE SET NULL
    ON UPDATE CASCADE,
  CONSTRAINT chk_sites_name_not_blank CHECK (CHAR_LENGTH(TRIM(name)) > 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS site_users (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  site_id BIGINT UNSIGNED NOT NULL,
  user_id BIGINT UNSIGNED NOT NULL,
  site_role VARCHAR(50) NULL,
  assigned_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  removed_at TIMESTAMP NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP NULL,
  UNIQUE KEY uq_site_users_site_user (site_id, user_id),
  KEY idx_site_users_user_id (user_id),
  KEY idx_site_users_site_role (site_role),
  CONSTRAINT fk_site_users_site_id
    FOREIGN KEY (site_id) REFERENCES sites(id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT fk_site_users_user_id
    FOREIGN KEY (user_id) REFERENCES users(id)
    ON DELETE CASCADE
    ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS site_locations (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  site_id BIGINT UNSIGNED NOT NULL,
  location_name VARCHAR(120) NOT NULL DEFAULT 'default',
  latitude DECIMAL(10,7) NOT NULL,
  longitude DECIMAL(10,7) NOT NULL,
  allowed_radius_meters INT UNSIGNED NOT NULL DEFAULT 150,
  is_primary TINYINT(1) NOT NULL DEFAULT 1,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP NULL,
  KEY idx_site_locations_site_id (site_id),
  KEY idx_site_locations_primary (site_id, is_primary),
  CONSTRAINT fk_site_locations_site_id
    FOREIGN KEY (site_id) REFERENCES sites(id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT chk_site_locations_radius_positive CHECK (allowed_radius_meters > 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS assignment_statuses (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  code VARCHAR(50) NOT NULL,
  name VARCHAR(100) NOT NULL,
  is_terminal TINYINT(1) NOT NULL DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP NULL,
  UNIQUE KEY uq_assignment_statuses_code (code)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- TASK / ISSUE WORKFLOW TABLES (audited)
-- =====================================================

CREATE TABLE IF NOT EXISTS tasks (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  status_id BIGINT UNSIGNED NOT NULL,
  priority_id BIGINT UNSIGNED NULL,
  level_id BIGINT UNSIGNED NULL,
  trade_id BIGINT UNSIGNED NULL,
  project_id BIGINT UNSIGNED NULL,
  site_id BIGINT UNSIGNED NULL,
  created_by_user_id BIGINT UNSIGNED NULL,
  -- Current assignee for common "assigned_to" queries/UI filters.
  assigned_to_user_id BIGINT UNSIGNED NULL,
  description TEXT NOT NULL,
  notes TEXT NULL,
  -- Flexible payload for future UI/workflow extensions.
  metadata JSON NULL,
  opened_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  due_at TIMESTAMP NULL,
  closed_at TIMESTAMP NULL,
  days_open INT UNSIGNED NOT NULL DEFAULT 0,
  -- Conditional audit columns
  created_by BIGINT UNSIGNED NULL,
  updated_by BIGINT UNSIGNED NULL,
  ip_address VARCHAR(45) NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP NULL,
  KEY idx_tasks_status_id (status_id),
  KEY idx_tasks_priority_id (priority_id),
  KEY idx_tasks_level_id (level_id),
  KEY idx_tasks_trade_id (trade_id),
  KEY idx_tasks_project_id (project_id),
  KEY idx_tasks_site_id (site_id),
  KEY idx_tasks_created_by_user_id (created_by_user_id),
  KEY idx_tasks_assigned_to_user_id (assigned_to_user_id),
  KEY idx_tasks_assigned_status (assigned_to_user_id, status_id, deleted_at),
  KEY idx_tasks_assigned_status_priority (assigned_to_user_id, status_id, priority_id, deleted_at),
  KEY idx_tasks_creator_status (created_by_user_id, status_id, deleted_at),
  KEY idx_tasks_due_at_status (due_at, status_id, deleted_at),
  KEY idx_tasks_project_site_status (project_id, site_id, status_id, deleted_at),
  KEY idx_tasks_opened_at (opened_at),
  KEY idx_tasks_days_open (days_open),
  KEY idx_tasks_created_by (created_by),
  KEY idx_tasks_created_by_created_at (created_by, created_at),
  KEY idx_tasks_updated_by (updated_by),
  KEY idx_tasks_deleted_at (deleted_at),
  FULLTEXT KEY ftx_tasks_description (description),
  CONSTRAINT fk_tasks_status_id
    FOREIGN KEY (status_id) REFERENCES task_statuses(id)
    ON DELETE RESTRICT
    ON UPDATE CASCADE,
  CONSTRAINT fk_tasks_priority_id
    FOREIGN KEY (priority_id) REFERENCES task_priorities(id)
    ON DELETE SET NULL
    ON UPDATE CASCADE,
  CONSTRAINT fk_tasks_level_id
    FOREIGN KEY (level_id) REFERENCES levels(id)
    ON DELETE SET NULL
    ON UPDATE CASCADE,
  CONSTRAINT fk_tasks_trade_id
    FOREIGN KEY (trade_id) REFERENCES trades(id)
    ON DELETE SET NULL
    ON UPDATE CASCADE,
  CONSTRAINT fk_tasks_project_id
    FOREIGN KEY (project_id) REFERENCES projects(id)
    ON DELETE SET NULL
    ON UPDATE CASCADE,
  CONSTRAINT fk_tasks_site_id
    FOREIGN KEY (site_id) REFERENCES sites(id)
    ON DELETE SET NULL
    ON UPDATE CASCADE,
  CONSTRAINT fk_tasks_created_by_user_id
    FOREIGN KEY (created_by_user_id) REFERENCES users(id)
    ON DELETE SET NULL
    ON UPDATE CASCADE,
  CONSTRAINT fk_tasks_assigned_to_user_id
    FOREIGN KEY (assigned_to_user_id) REFERENCES users(id)
    ON DELETE SET NULL
    ON UPDATE CASCADE,
  CONSTRAINT fk_tasks_created_by
    FOREIGN KEY (created_by) REFERENCES users(id)
    ON DELETE SET NULL
    ON UPDATE CASCADE,
  CONSTRAINT fk_tasks_updated_by
    FOREIGN KEY (updated_by) REFERENCES users(id)
    ON DELETE SET NULL
    ON UPDATE CASCADE,
  CONSTRAINT chk_tasks_description_not_blank CHECK (CHAR_LENGTH(TRIM(description)) > 0),
  CONSTRAINT chk_tasks_due_after_open CHECK (due_at IS NULL OR due_at >= opened_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS task_assignments (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  task_id BIGINT UNSIGNED NOT NULL,
  assignee_user_id BIGINT UNSIGNED NULL,
  assigned_by_user_id BIGINT UNSIGNED NULL,
  assignment_status_id BIGINT UNSIGNED NULL,
  notes TEXT NULL,
  metadata JSON NULL,
  assigned_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  responded_at TIMESTAMP NULL,
  unassigned_at TIMESTAMP NULL,
  -- Conditional audit columns
  created_by BIGINT UNSIGNED NULL,
  updated_by BIGINT UNSIGNED NULL,
  ip_address VARCHAR(45) NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP NULL,
  UNIQUE KEY uq_task_assignments_task_assignee_assigned_at (task_id, assignee_user_id, assigned_at),
  KEY idx_task_assignments_task_id (task_id),
  KEY idx_task_assignments_assignee_user_id (assignee_user_id),
  KEY idx_task_assignments_assigned_by_user_id (assigned_by_user_id),
  KEY idx_task_assignments_assignment_status_id (assignment_status_id),
  KEY idx_task_assignments_assignee_assigned_at (assignee_user_id, assigned_at, deleted_at),
  KEY idx_task_assignments_task_status_assigned_at (task_id, assignment_status_id, assigned_at),
  KEY idx_task_assignments_assigned_at (assigned_at),
  KEY idx_task_assignments_created_by (created_by),
  KEY idx_task_assignments_created_by_created_at (created_by, created_at),
  KEY idx_task_assignments_updated_by (updated_by),
  CONSTRAINT fk_task_assignments_task_id
    FOREIGN KEY (task_id) REFERENCES tasks(id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT fk_task_assignments_assignee_user_id
    FOREIGN KEY (assignee_user_id) REFERENCES users(id)
    ON DELETE SET NULL
    ON UPDATE CASCADE,
  CONSTRAINT fk_task_assignments_assigned_by_user_id
    FOREIGN KEY (assigned_by_user_id) REFERENCES users(id)
    ON DELETE SET NULL
    ON UPDATE CASCADE,
  CONSTRAINT fk_task_assignments_assignment_status_id
    FOREIGN KEY (assignment_status_id) REFERENCES assignment_statuses(id)
    ON DELETE RESTRICT
    ON UPDATE CASCADE,
  CONSTRAINT fk_task_assignments_created_by
    FOREIGN KEY (created_by) REFERENCES users(id)
    ON DELETE SET NULL
    ON UPDATE CASCADE,
  CONSTRAINT fk_task_assignments_updated_by
    FOREIGN KEY (updated_by) REFERENCES users(id)
    ON DELETE SET NULL
    ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS task_assignment_responses (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  assignment_id BIGINT UNSIGNED NOT NULL,
  response_status_id BIGINT UNSIGNED NOT NULL,
  responded_by_user_id BIGINT UNSIGNED NULL,
  response_note TEXT NULL,
  responded_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  metadata JSON NULL,
  -- Conditional audit columns
  created_by BIGINT UNSIGNED NULL,
  updated_by BIGINT UNSIGNED NULL,
  ip_address VARCHAR(45) NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP NULL,
  KEY idx_task_assignment_responses_assignment_id (assignment_id),
  KEY idx_task_assignment_responses_response_status_id (response_status_id),
  KEY idx_task_assignment_responses_responded_by_user_id (responded_by_user_id),
  KEY idx_task_assignment_responses_responded_at (responded_at),
  CONSTRAINT fk_task_assignment_responses_assignment_id
    FOREIGN KEY (assignment_id) REFERENCES task_assignments(id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT fk_task_assignment_responses_response_status_id
    FOREIGN KEY (response_status_id) REFERENCES assignment_statuses(id)
    ON DELETE RESTRICT
    ON UPDATE CASCADE,
  CONSTRAINT fk_task_assignment_responses_responded_by_user_id
    FOREIGN KEY (responded_by_user_id) REFERENCES users(id)
    ON DELETE SET NULL
    ON UPDATE CASCADE,
  CONSTRAINT fk_task_assignment_responses_created_by
    FOREIGN KEY (created_by) REFERENCES users(id)
    ON DELETE SET NULL
    ON UPDATE CASCADE,
  CONSTRAINT fk_task_assignment_responses_updated_by
    FOREIGN KEY (updated_by) REFERENCES users(id)
    ON DELETE SET NULL
    ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS task_completions (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  task_id BIGINT UNSIGNED NOT NULL,
  completed_by_user_id BIGINT UNSIGNED NULL,
  notes TEXT NULL,
  metadata JSON NULL,
  completed_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  duration_days INT UNSIGNED NOT NULL,
  -- Conditional audit columns
  created_by BIGINT UNSIGNED NULL,
  updated_by BIGINT UNSIGNED NULL,
  ip_address VARCHAR(45) NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP NULL,
  UNIQUE KEY uq_task_completions_task_id (task_id),
  KEY idx_task_completions_completed_by_user_id (completed_by_user_id),
  KEY idx_task_completions_completed_by_completed_at (completed_by_user_id, completed_at),
  KEY idx_task_completions_completed_at (completed_at),
  KEY idx_task_completions_created_by (created_by),
  KEY idx_task_completions_created_by_created_at (created_by, created_at),
  KEY idx_task_completions_updated_by (updated_by),
  CONSTRAINT fk_task_completions_task_id
    FOREIGN KEY (task_id) REFERENCES tasks(id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT fk_task_completions_completed_by_user_id
    FOREIGN KEY (completed_by_user_id) REFERENCES users(id)
    ON DELETE SET NULL
    ON UPDATE CASCADE,
  CONSTRAINT fk_task_completions_created_by
    FOREIGN KEY (created_by) REFERENCES users(id)
    ON DELETE SET NULL
    ON UPDATE CASCADE,
  CONSTRAINT fk_task_completions_updated_by
    FOREIGN KEY (updated_by) REFERENCES users(id)
    ON DELETE SET NULL
    ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS task_filter_values (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  task_id BIGINT UNSIGNED NOT NULL,
  filter_option_id BIGINT UNSIGNED NOT NULL,
  -- Conditional audit columns (user-driven task filter tagging)
  created_by BIGINT UNSIGNED NULL,
  updated_by BIGINT UNSIGNED NULL,
  ip_address VARCHAR(45) NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP NULL,
  UNIQUE KEY uq_task_filter_values_task_option (task_id, filter_option_id),
  KEY idx_task_filter_values_task_id (task_id),
  KEY idx_task_filter_values_filter_option_id (filter_option_id),
  KEY idx_task_filter_values_created_by (created_by),
  KEY idx_task_filter_values_updated_by (updated_by),
  KEY idx_task_filter_values_created_by_created_at (created_by, created_at),
  CONSTRAINT fk_task_filter_values_task_id
    FOREIGN KEY (task_id) REFERENCES tasks(id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT fk_task_filter_values_filter_option_id
    FOREIGN KEY (filter_option_id) REFERENCES filter_options(id)
    ON DELETE RESTRICT
    ON UPDATE CASCADE,
  CONSTRAINT fk_task_filter_values_created_by
    FOREIGN KEY (created_by) REFERENCES users(id)
    ON DELETE SET NULL
    ON UPDATE CASCADE,
  CONSTRAINT fk_task_filter_values_updated_by
    FOREIGN KEY (updated_by) REFERENCES users(id)
    ON DELETE SET NULL
    ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- TASK COLLABORATION TABLES (comments + history tracking)
-- =====================================================

CREATE TABLE IF NOT EXISTS task_comments (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  task_id BIGINT UNSIGNED NOT NULL,
  comment TEXT NOT NULL,
  metadata JSON NULL,
  -- Conditional audit columns
  created_by BIGINT UNSIGNED NULL,
  updated_by BIGINT UNSIGNED NULL,
  ip_address VARCHAR(45) NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP NULL,
  KEY idx_task_comments_task_id (task_id),
  KEY idx_task_comments_task_created_at (task_id, created_at),
  KEY idx_task_comments_created_by (created_by),
  KEY idx_task_comments_updated_by (updated_by),
  KEY idx_task_comments_created_by_created_at (created_by, created_at),
  CONSTRAINT fk_task_comments_task_id
    FOREIGN KEY (task_id) REFERENCES tasks(id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT fk_task_comments_created_by
    FOREIGN KEY (created_by) REFERENCES users(id)
    ON DELETE SET NULL
    ON UPDATE CASCADE,
  CONSTRAINT fk_task_comments_updated_by
    FOREIGN KEY (updated_by) REFERENCES users(id)
    ON DELETE SET NULL
    ON UPDATE CASCADE,
  CONSTRAINT chk_task_comments_comment_not_blank CHECK (CHAR_LENGTH(TRIM(comment)) > 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS task_history (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  task_id BIGINT UNSIGNED NOT NULL,
  -- Explicit old/new fields for workflow transition tracking.
  old_status_id BIGINT UNSIGNED NULL,
  new_status_id BIGINT UNSIGNED NULL,
  old_assignee_user_id BIGINT UNSIGNED NULL,
  new_assignee_user_id BIGINT UNSIGNED NULL,
  change_reason TEXT NULL,
  notes TEXT NULL,
  metadata JSON NULL,
  changed_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  -- Conditional audit columns
  changed_by BIGINT UNSIGNED NULL,
  created_by BIGINT UNSIGNED NULL,
  updated_by BIGINT UNSIGNED NULL,
  ip_address VARCHAR(45) NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP NULL,
  KEY idx_task_history_task_id (task_id),
  KEY idx_task_history_task_changed_at (task_id, changed_at),
  KEY idx_task_history_old_status_id (old_status_id),
  KEY idx_task_history_new_status_id (new_status_id),
  KEY idx_task_history_old_assignee_user_id (old_assignee_user_id),
  KEY idx_task_history_new_assignee_user_id (new_assignee_user_id),
  KEY idx_task_history_changed_by (changed_by),
  KEY idx_task_history_created_by (created_by),
  KEY idx_task_history_updated_by (updated_by),
  KEY idx_task_history_created_by_created_at (created_by, created_at),
  CONSTRAINT fk_task_history_task_id
    FOREIGN KEY (task_id) REFERENCES tasks(id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT fk_task_history_old_status_id
    FOREIGN KEY (old_status_id) REFERENCES task_statuses(id)
    ON DELETE SET NULL
    ON UPDATE CASCADE,
  CONSTRAINT fk_task_history_new_status_id
    FOREIGN KEY (new_status_id) REFERENCES task_statuses(id)
    ON DELETE SET NULL
    ON UPDATE CASCADE,
  CONSTRAINT fk_task_history_old_assignee_user_id
    FOREIGN KEY (old_assignee_user_id) REFERENCES users(id)
    ON DELETE SET NULL
    ON UPDATE CASCADE,
  CONSTRAINT fk_task_history_new_assignee_user_id
    FOREIGN KEY (new_assignee_user_id) REFERENCES users(id)
    ON DELETE SET NULL
    ON UPDATE CASCADE,
  CONSTRAINT fk_task_history_changed_by
    FOREIGN KEY (changed_by) REFERENCES users(id)
    ON DELETE SET NULL
    ON UPDATE CASCADE,
  CONSTRAINT fk_task_history_created_by
    FOREIGN KEY (created_by) REFERENCES users(id)
    ON DELETE SET NULL
    ON UPDATE CASCADE,
  CONSTRAINT fk_task_history_updated_by
    FOREIGN KEY (updated_by) REFERENCES users(id)
    ON DELETE SET NULL
    ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- NOTIFICATIONS (task assignment/status + general user alerts)
-- =====================================================

CREATE TABLE IF NOT EXISTS notification_channels (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  code VARCHAR(50) NOT NULL,
  name VARCHAR(100) NOT NULL,
  is_active TINYINT(1) NOT NULL DEFAULT 1,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP NULL,
  UNIQUE KEY uq_notification_channels_code (code)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS notification_templates (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  template_key VARCHAR(120) NOT NULL,
  channel_id BIGINT UNSIGNED NOT NULL,
  title_template VARCHAR(255) NOT NULL,
  body_template TEXT NOT NULL,
  is_active TINYINT(1) NOT NULL DEFAULT 1,
  metadata JSON NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP NULL,
  UNIQUE KEY uq_notification_templates_key_channel (template_key, channel_id),
  KEY idx_notification_templates_channel_id (channel_id),
  CONSTRAINT fk_notification_templates_channel_id
    FOREIGN KEY (channel_id) REFERENCES notification_channels(id)
    ON DELETE RESTRICT
    ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS notifications (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id BIGINT UNSIGNED NOT NULL,
  channel_id BIGINT UNSIGNED NULL,
  template_id BIGINT UNSIGNED NULL,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  type VARCHAR(50) NOT NULL,
  is_read TINYINT(1) NOT NULL DEFAULT 0,
  entity_type VARCHAR(50) NULL,
  entity_id BIGINT UNSIGNED NULL,
  source_event_key VARCHAR(120) NULL,
  scheduled_for TIMESTAMP NULL,
  read_at TIMESTAMP NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  KEY idx_notifications_user_id (user_id),
  KEY idx_notifications_user_read (user_id, is_read),
  KEY idx_notifications_user_read_created (user_id, is_read, created_at),
  KEY idx_notifications_entity (entity_type, entity_id),
  KEY idx_notifications_type_created (type, created_at),
  KEY idx_notifications_created_at (created_at),
  CONSTRAINT fk_notifications_user_id
    FOREIGN KEY (user_id) REFERENCES users(id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT fk_notifications_channel_id
    FOREIGN KEY (channel_id) REFERENCES notification_channels(id)
    ON DELETE SET NULL
    ON UPDATE CASCADE,
  CONSTRAINT fk_notifications_template_id
    FOREIGN KEY (template_id) REFERENCES notification_templates(id)
    ON DELETE SET NULL
    ON UPDATE CASCADE,
  CONSTRAINT chk_notifications_title_not_blank CHECK (CHAR_LENGTH(TRIM(title)) > 0),
  CONSTRAINT chk_notifications_message_not_blank CHECK (CHAR_LENGTH(TRIM(message)) > 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS notification_settings (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id BIGINT UNSIGNED NOT NULL,
  notify_task_assigned TINYINT(1) NOT NULL DEFAULT 1,
  notify_status_changed TINYINT(1) NOT NULL DEFAULT 1,
  notify_general TINYINT(1) NOT NULL DEFAULT 1,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uq_notification_settings_user_id (user_id),
  CONSTRAINT fk_notification_settings_user_id
    FOREIGN KEY (user_id) REFERENCES users(id)
    ON DELETE CASCADE
    ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS notification_setting_channels (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id BIGINT UNSIGNED NOT NULL,
  channel_id BIGINT UNSIGNED NOT NULL,
  is_enabled TINYINT(1) NOT NULL DEFAULT 1,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uq_notification_setting_channels_user_channel (user_id, channel_id),
  KEY idx_notification_setting_channels_channel_id (channel_id),
  CONSTRAINT fk_notification_setting_channels_user_id
    FOREIGN KEY (user_id) REFERENCES users(id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT fk_notification_setting_channels_channel_id
    FOREIGN KEY (channel_id) REFERENCES notification_channels(id)
    ON DELETE CASCADE
    ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS user_device_tokens (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id BIGINT UNSIGNED NOT NULL,
  channel_id BIGINT UNSIGNED NULL,
  device_token VARCHAR(512) NOT NULL,
  device_type VARCHAR(20) NOT NULL,
  platform VARCHAR(30) NULL,
  app_version VARCHAR(40) NULL,
  last_seen_at TIMESTAMP NULL,
  revoked_at TIMESTAMP NULL,
  metadata JSON NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP NULL,
  UNIQUE KEY uq_user_device_tokens_token (device_token),
  KEY idx_user_device_tokens_user_id (user_id),
  KEY idx_user_device_tokens_channel_id (channel_id),
  KEY idx_user_device_tokens_user_revoked (user_id, revoked_at),
  CONSTRAINT fk_user_device_tokens_user_id
    FOREIGN KEY (user_id) REFERENCES users(id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT fk_user_device_tokens_channel_id
    FOREIGN KEY (channel_id) REFERENCES notification_channels(id)
    ON DELETE SET NULL
    ON UPDATE CASCADE,
  CONSTRAINT chk_user_device_tokens_device_type CHECK (device_type IN ('ios', 'android', 'web'))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS scheduled_notifications (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id BIGINT UNSIGNED NOT NULL,
  channel_id BIGINT UNSIGNED NULL,
  template_id BIGINT UNSIGNED NULL,
  type VARCHAR(50) NOT NULL,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  entity_type VARCHAR(50) NULL,
  entity_id BIGINT UNSIGNED NULL,
  scheduled_for TIMESTAMP NOT NULL,
  processed_at TIMESTAMP NULL,
  process_status VARCHAR(30) NOT NULL DEFAULT 'pending',
  metadata JSON NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP NULL,
  KEY idx_scheduled_notifications_user_id (user_id),
  KEY idx_scheduled_notifications_schedule_status (scheduled_for, process_status),
  KEY idx_scheduled_notifications_entity (entity_type, entity_id),
  CONSTRAINT fk_scheduled_notifications_user_id
    FOREIGN KEY (user_id) REFERENCES users(id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT fk_scheduled_notifications_channel_id
    FOREIGN KEY (channel_id) REFERENCES notification_channels(id)
    ON DELETE SET NULL
    ON UPDATE CASCADE,
  CONSTRAINT fk_scheduled_notifications_template_id
    FOREIGN KEY (template_id) REFERENCES notification_templates(id)
    ON DELETE SET NULL
    ON UPDATE CASCADE,
  CONSTRAINT chk_scheduled_notifications_status CHECK (process_status IN ('pending', 'processing', 'sent', 'failed', 'cancelled'))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS notification_logs (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  notification_id BIGINT UNSIGNED NULL,
  scheduled_notification_id BIGINT UNSIGNED NULL,
  user_id BIGINT UNSIGNED NOT NULL,
  channel_id BIGINT UNSIGNED NULL,
  device_token_id BIGINT UNSIGNED NULL,
  provider_message_id VARCHAR(255) NULL,
  delivery_status VARCHAR(30) NOT NULL,
  delivery_error TEXT NULL,
  attempted_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  delivered_at TIMESTAMP NULL,
  metadata JSON NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP NULL,
  KEY idx_notification_logs_notification_id (notification_id),
  KEY idx_notification_logs_scheduled_notification_id (scheduled_notification_id),
  KEY idx_notification_logs_user_id (user_id),
  KEY idx_notification_logs_channel_status_attempted (channel_id, delivery_status, attempted_at),
  KEY idx_notification_logs_device_token_id (device_token_id),
  CONSTRAINT fk_notification_logs_notification_id
    FOREIGN KEY (notification_id) REFERENCES notifications(id)
    ON DELETE SET NULL
    ON UPDATE CASCADE,
  CONSTRAINT fk_notification_logs_scheduled_notification_id
    FOREIGN KEY (scheduled_notification_id) REFERENCES scheduled_notifications(id)
    ON DELETE SET NULL
    ON UPDATE CASCADE,
  CONSTRAINT fk_notification_logs_user_id
    FOREIGN KEY (user_id) REFERENCES users(id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT fk_notification_logs_channel_id
    FOREIGN KEY (channel_id) REFERENCES notification_channels(id)
    ON DELETE SET NULL
    ON UPDATE CASCADE,
  CONSTRAINT fk_notification_logs_device_token_id
    FOREIGN KEY (device_token_id) REFERENCES user_device_tokens(id)
    ON DELETE SET NULL
    ON UPDATE CASCADE,
  CONSTRAINT chk_notification_logs_delivery_status CHECK (delivery_status IN ('queued', 'sent', 'delivered', 'read', 'failed', 'bounced'))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- OFFLINE SYNC / INTEGRATION / EXPORT
-- =====================================================

CREATE TABLE IF NOT EXISTS device_sync_states (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id BIGINT UNSIGNED NOT NULL,
  device_token_id BIGINT UNSIGNED NULL,
  last_pull_at TIMESTAMP NULL,
  last_push_at TIMESTAMP NULL,
  last_server_change_id BIGINT UNSIGNED NULL,
  sync_state VARCHAR(30) NOT NULL DEFAULT 'idle',
  last_error TEXT NULL,
  metadata JSON NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP NULL,
  KEY idx_device_sync_states_user_id (user_id),
  KEY idx_device_sync_states_device_token_id (device_token_id),
  KEY idx_device_sync_states_sync_state (sync_state),
  CONSTRAINT fk_device_sync_states_user_id
    FOREIGN KEY (user_id) REFERENCES users(id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT fk_device_sync_states_device_token_id
    FOREIGN KEY (device_token_id) REFERENCES user_device_tokens(id)
    ON DELETE SET NULL
    ON UPDATE CASCADE,
  CONSTRAINT chk_device_sync_states_state CHECK (sync_state IN ('idle', 'in_progress', 'failed'))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS sync_logs (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id BIGINT UNSIGNED NOT NULL,
  device_token_id BIGINT UNSIGNED NULL,
  direction VARCHAR(20) NOT NULL,
  sync_started_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  sync_finished_at TIMESTAMP NULL,
  sync_status VARCHAR(30) NOT NULL DEFAULT 'started',
  records_processed INT UNSIGNED NOT NULL DEFAULT 0,
  error_message TEXT NULL,
  metadata JSON NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP NULL,
  KEY idx_sync_logs_user_id (user_id),
  KEY idx_sync_logs_device_token_id (device_token_id),
  KEY idx_sync_logs_started_status (sync_started_at, sync_status),
  CONSTRAINT fk_sync_logs_user_id
    FOREIGN KEY (user_id) REFERENCES users(id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT fk_sync_logs_device_token_id
    FOREIGN KEY (device_token_id) REFERENCES user_device_tokens(id)
    ON DELETE SET NULL
    ON UPDATE CASCADE,
  CONSTRAINT chk_sync_logs_direction CHECK (direction IN ('pull', 'push', 'bidirectional')),
  CONSTRAINT chk_sync_logs_status CHECK (sync_status IN ('started', 'completed', 'failed', 'partial'))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS change_queue (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  entity_type VARCHAR(60) NOT NULL,
  entity_id BIGINT UNSIGNED NULL,
  operation_type VARCHAR(20) NOT NULL,
  changed_by BIGINT UNSIGNED NULL,
  changed_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  payload JSON NULL,
  processed_at TIMESTAMP NULL,
  process_status VARCHAR(30) NOT NULL DEFAULT 'pending',
  retry_count INT UNSIGNED NOT NULL DEFAULT 0,
  last_error TEXT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP NULL,
  KEY idx_change_queue_entity (entity_type, entity_id),
  KEY idx_change_queue_status_changed_at (process_status, changed_at),
  KEY idx_change_queue_changed_by (changed_by),
  CONSTRAINT fk_change_queue_changed_by
    FOREIGN KEY (changed_by) REFERENCES users(id)
    ON DELETE SET NULL
    ON UPDATE CASCADE,
  CONSTRAINT chk_change_queue_operation CHECK (operation_type IN ('create', 'update', 'delete')),
  CONSTRAINT chk_change_queue_status CHECK (process_status IN ('pending', 'processing', 'completed', 'failed', 'dead_letter'))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS export_jobs (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  requested_by BIGINT UNSIGNED NULL,
  export_type VARCHAR(50) NOT NULL,
  filter_json JSON NULL,
  output_format VARCHAR(20) NOT NULL DEFAULT 'csv',
  file_url VARCHAR(1024) NULL,
  status VARCHAR(30) NOT NULL DEFAULT 'queued',
  started_at TIMESTAMP NULL,
  completed_at TIMESTAMP NULL,
  error_message TEXT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP NULL,
  KEY idx_export_jobs_requested_by (requested_by),
  KEY idx_export_jobs_status_created_at (status, created_at),
  CONSTRAINT fk_export_jobs_requested_by
    FOREIGN KEY (requested_by) REFERENCES users(id)
    ON DELETE SET NULL
    ON UPDATE CASCADE,
  CONSTRAINT chk_export_jobs_status CHECK (status IN ('queued', 'processing', 'completed', 'failed', 'cancelled')),
  CONSTRAINT chk_export_jobs_output_format CHECK (output_format IN ('csv', 'xlsx', 'pdf', 'json'))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS task_metrics (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  metric_date DATE NOT NULL,
  project_id BIGINT UNSIGNED NULL,
  site_id BIGINT UNSIGNED NULL,
  trade_id BIGINT UNSIGNED NULL,
  level_id BIGINT UNSIGNED NULL,
  open_count INT UNSIGNED NOT NULL DEFAULT 0,
  completed_count INT UNSIGNED NOT NULL DEFAULT 0,
  overdue_count INT UNSIGNED NOT NULL DEFAULT 0,
  avg_completion_days DECIMAL(8,2) NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP NULL,
  UNIQUE KEY uq_task_metrics_slice (metric_date, project_id, site_id, trade_id, level_id),
  KEY idx_task_metrics_project_site_date (project_id, site_id, metric_date),
  KEY idx_task_metrics_trade_level_date (trade_id, level_id, metric_date),
  CONSTRAINT fk_task_metrics_project_id
    FOREIGN KEY (project_id) REFERENCES projects(id)
    ON DELETE SET NULL
    ON UPDATE CASCADE,
  CONSTRAINT fk_task_metrics_site_id
    FOREIGN KEY (site_id) REFERENCES sites(id)
    ON DELETE SET NULL
    ON UPDATE CASCADE,
  CONSTRAINT fk_task_metrics_trade_id
    FOREIGN KEY (trade_id) REFERENCES trades(id)
    ON DELETE SET NULL
    ON UPDATE CASCADE,
  CONSTRAINT fk_task_metrics_level_id
    FOREIGN KEY (level_id) REFERENCES levels(id)
    ON DELETE SET NULL
    ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- ATTACHMENTS (image/photo/video upload support)
-- =====================================================

CREATE TABLE IF NOT EXISTS attachments (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  -- Generic reference for future entities (task, listing, project, etc.).
  entity_type VARCHAR(50) NOT NULL,
  entity_id BIGINT UNSIGNED NULL,
  -- Strong FK path for task attachments with cascade behavior.
  task_id BIGINT UNSIGNED NULL,
  file_url VARCHAR(1024) NOT NULL,
  file_name VARCHAR(255) NOT NULL,
  -- Extension/type for lightweight validation and filtering (jpg, png, mp4, etc.).
  file_type VARCHAR(50) NOT NULL,
  -- MIME for stricter server-side validation if needed.
  mime_type VARCHAR(100) NULL,
  storage_provider VARCHAR(50) NULL,
  storage_key VARCHAR(512) NULL,
  checksum_sha256 CHAR(64) NULL,
  file_size BIGINT UNSIGNED NOT NULL,
  uploaded_by BIGINT UNSIGNED NULL,
  -- Before/after evidence and capture context from docs.
  is_before TINYINT(1) NOT NULL DEFAULT 0,
  is_after TINYINT(1) NOT NULL DEFAULT 0,
  captured_at TIMESTAMP NULL,
  captured_lat DECIMAL(10,7) NULL,
  captured_lng DECIMAL(10,7) NULL,
  annotation_json JSON NULL,
  metadata JSON NULL,
  -- Conditional audit columns (user-driven upload actions).
  created_by BIGINT UNSIGNED NULL,
  updated_by BIGINT UNSIGNED NULL,
  ip_address VARCHAR(45) NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP NULL,
  KEY idx_attachments_entity (entity_type, entity_id),
  KEY idx_attachments_task_id (task_id),
  KEY idx_attachments_uploaded_by (uploaded_by),
  KEY idx_attachments_checksum_sha256 (checksum_sha256),
  KEY idx_attachments_created_by (created_by),
  KEY idx_attachments_updated_by (updated_by),
  KEY idx_attachments_created_by_created_at (created_by, created_at),
  CONSTRAINT fk_attachments_task_id
    FOREIGN KEY (task_id) REFERENCES tasks(id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT fk_attachments_uploaded_by
    FOREIGN KEY (uploaded_by) REFERENCES users(id)
    ON DELETE SET NULL
    ON UPDATE CASCADE,
  CONSTRAINT fk_attachments_created_by
    FOREIGN KEY (created_by) REFERENCES users(id)
    ON DELETE SET NULL
    ON UPDATE CASCADE,
  CONSTRAINT fk_attachments_updated_by
    FOREIGN KEY (updated_by) REFERENCES users(id)
    ON DELETE SET NULL
    ON UPDATE CASCADE,
  CONSTRAINT chk_attachments_file_size_nonzero CHECK (file_size > 0),
  CONSTRAINT chk_attachments_geo_pair CHECK (
    (captured_lat IS NULL AND captured_lng IS NULL) OR
    (captured_lat IS NOT NULL AND captured_lng IS NOT NULL)
  )
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- AUDIT LOGS (required action history)
-- =====================================================

CREATE TABLE IF NOT EXISTS audit_logs (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  table_name VARCHAR(100) NOT NULL,
  record_id BIGINT UNSIGNED NULL,
  action_type VARCHAR(20) NOT NULL,
  old_value JSON NULL,
  new_value JSON NULL,
  performed_by BIGINT UNSIGNED NULL,
  ip_address VARCHAR(45) NULL,
  request_id VARCHAR(100) NULL,
  user_agent VARCHAR(500) NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP NULL,
  KEY idx_audit_logs_table_record (table_name, record_id),
  KEY idx_audit_logs_table_name (table_name),
  KEY idx_audit_logs_record_id (record_id),
  KEY idx_audit_logs_action_type (action_type),
  KEY idx_audit_logs_performed_by (performed_by),
  KEY idx_audit_logs_created_at (created_at),
  KEY idx_audit_logs_request_id (request_id),
  CONSTRAINT fk_audit_logs_performed_by
    FOREIGN KEY (performed_by) REFERENCES users(id)
    ON DELETE SET NULL
    ON UPDATE CASCADE,
  CONSTRAINT chk_audit_logs_action_type CHECK (action_type IN ('CREATE', 'UPDATE', 'DELETE'))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- OPTIONAL SEED NOTES (run via migration/seeder)
-- user_types: field_user, trade_user, management
-- roles: field_user, trade_user, manager_admin
-- task_statuses: open, completed, deleted
-- task_priorities: low, medium, high
-- filter_categories: trade, level (+ dynamic categories)
-- =====================================================
