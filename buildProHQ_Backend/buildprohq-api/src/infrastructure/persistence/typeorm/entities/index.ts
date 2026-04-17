export * from './shared';
export * from './lookup';
export * from './user';
export * from './project';
export * from './task';
export * from './notification';
export * from './sync';
export * from './audit';

import { LOOKUP_TYPEORM_ENTITIES } from './lookup';
import { USER_TYPEORM_ENTITIES } from './user';
import { PROJECT_TYPEORM_ENTITIES } from './project';
import { TASK_TYPEORM_ENTITIES } from './task';
import { NOTIFICATION_TYPEORM_ENTITIES } from './notification';
import { SYNC_TYPEORM_ENTITIES } from './sync';
import { AUDIT_TYPEORM_ENTITIES } from './audit';
import { DYNAMIC_PROJECT_FILTER_ENTITIES } from './project/dynamic-filters.entities';

export const ALL_TYPEORM_ENTITIES = [
  ...LOOKUP_TYPEORM_ENTITIES,
  ...USER_TYPEORM_ENTITIES,
  ...PROJECT_TYPEORM_ENTITIES,
  ...TASK_TYPEORM_ENTITIES,
  ...DYNAMIC_PROJECT_FILTER_ENTITIES,
  ...NOTIFICATION_TYPEORM_ENTITIES,
  ...SYNC_TYPEORM_ENTITIES,
  ...AUDIT_TYPEORM_ENTITIES,
];
