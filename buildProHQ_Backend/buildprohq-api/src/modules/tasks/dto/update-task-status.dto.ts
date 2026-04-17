import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsString } from 'class-validator';
import { MESSAGES } from '../../../infrastructure/common/constants/messages';

export const ALLOWED_TASK_STATUS_NAMES = [
  'Open',
  'In Progress',
  'Completed',
] as const;
export type AllowedTaskStatusName = (typeof ALLOWED_TASK_STATUS_NAMES)[number];

export class UpdateTaskStatusDto {
  @ApiProperty({
    description: 'New task status name.',
    enum: ALLOWED_TASK_STATUS_NAMES,
    example: 'In Progress',
  })
  @IsString({ message: MESSAGES.TASK_VALIDATION.STATUS_NAME_INVALID })
  @IsIn(ALLOWED_TASK_STATUS_NAMES, {
    message: MESSAGES.TASK_VALIDATION.STATUS_NAME_INVALID,
  })
  status!: AllowedTaskStatusName;
}
