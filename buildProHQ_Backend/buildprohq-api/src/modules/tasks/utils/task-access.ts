import { ForbiddenException } from '@nestjs/common';
import { MESSAGES } from '../../../infrastructure/common/constants/messages';
import type { AuthUser } from '../../../infrastructure/common/interfaces/auth-user.interface';

export function enforceTaskReadScope(user: AuthUser, task: any): void {
  if (user.role === 'super_admin') return;
  if (user.role === 'manager') return;
  if (user.role === 'trade_user' && task.assigned_to_user_id !== user.id) {
    throw new ForbiddenException(MESSAGES.TASKS.READ_SCOPE_DENIED);
  }
  if (
    user.role === 'field_user' &&
    task.created_by_user_id !== user.id &&
    task.assigned_to_user_id !== user.id
  ) {
    throw new ForbiddenException(MESSAGES.TASKS.READ_SCOPE_DENIED);
  }
}

export function enforceTaskWriteScope(user: AuthUser, task: any): void {
  if (user.role === 'super_admin') return;
  if (user.role === 'manager') return;
  if (user.role === 'field_user' && task.created_by_user_id === user.id) return;
  throw new ForbiddenException(MESSAGES.TASKS.UPDATE_SCOPE_DENIED);
}

export function enforceTaskDeleteScope(user: AuthUser, task: any): void {
  if (user.role === 'super_admin') return;
  if (user.role === 'manager') return;
  if (user.role === 'field_user' && task.created_by_user_id === user.id) return;
  throw new ForbiddenException(MESSAGES.TASKS.DELETE_SCOPE_DENIED);
}

export function enforceTaskCompleteScope(user: AuthUser, task: any): void {
  if (user.role === 'super_admin') return;
  if (user.role === 'manager') return;
  if (user.role === 'trade_user' && task.assigned_to_user_id === user.id)
    return;
  if (user.role === 'field_user' && task.created_by_user_id === user.id) return;
  throw new ForbiddenException(MESSAGES.TASKS.COMPLETE_SCOPE_DENIED);
}
