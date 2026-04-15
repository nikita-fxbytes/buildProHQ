import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsDateString,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  MinLength,
  Validate,
  ValidateIf,
} from 'class-validator';
import { MESSAGES } from '../../../infrastructure/common/constants/messages';
import { IsRichTaskDescriptionConstraint } from '../../../infrastructure/common/validators/rich-description.constraint';

export class CreateTaskDto {
  @ApiProperty({
    description: 'Short task title shown in lists and headers.',
    example: 'Patch drywall in unit 12B',
    maxLength: 500,
  })
  @IsString({ message: MESSAGES.TASK_VALIDATION.TITLE_REQUIRED })
  @MinLength(1, { message: MESSAGES.TASK_VALIDATION.TITLE_REQUIRED })
  @MaxLength(500, { message: MESSAGES.TASK_VALIDATION.TITLE_MAX_LENGTH })
  title!: string;

  @ApiProperty({
    description: 'Project id this task belongs to.',
    example: '15004760-efa3-406e-9a24-18a6c64f8d51',
  })
  @IsUUID('4', { message: MESSAGES.TASK_VALIDATION.PROJECT_ID_INVALID })
  projectId!: string;

  @ApiProperty({
    description: 'Task status id (use open status when creating a new action item).',
    example: '1b6a0fb1-2d3f-4f05-8c7f-5c9fdb1e3d42',
  })
  @IsUUID('4', { message: MESSAGES.TASK_VALIDATION.STATUS_ID_INVALID })
  statusId!: string;

  @ApiPropertyOptional({
    description:
      'Priority id from GET /lookups/task-priorities. Must reference a standard level: codes `low`, `medium`, `high`, or `critical` (UI may show `critical` as Urgent). Omit for no priority.',
  })
  @IsOptional()
  @IsUUID('4', { message: MESSAGES.TASK_VALIDATION.PRIORITY_ID_INVALID })
  priorityId?: string;

  @ApiProperty({
    description: 'Building level id.',
    example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  })
  @IsUUID('4', { message: MESSAGES.TASK_VALIDATION.LEVEL_ID_INVALID })
  levelId!: string;

  @ApiProperty({
    description: 'Trade id.',
    example: 'b2c3d4e5-f6a7-8901-bcde-f12345678901',
  })
  @IsUUID('4', { message: MESSAGES.TASK_VALIDATION.TRADE_ID_INVALID })
  tradeId!: string;

  @ApiPropertyOptional({
    description: 'User id to assign the task to (optional).',
  })
  @ValidateIf((_, v) => v !== undefined && v !== null)
  @IsUUID('4', { message: MESSAGES.TASK_VALIDATION.ASSIGNED_USER_ID_INVALID })
  assignedToUserId?: string | null;

  @ApiPropertyOptional({
    description: 'User ids to assign the task to (multi-assign).',
    type: [String],
    example: ['15004760-efa3-406e-9a24-18a6c64f8d51'],
  })
  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true, message: MESSAGES.TASK_VALIDATION.ASSIGNED_USER_ID_INVALID })
  assignedToUserIds?: string[];

  @ApiPropertyOptional({
    description: 'Due date / deadline (optional). ISO date string, e.g. 2026-04-15.',
    example: '2026-04-15',
  })
  @ValidateIf((_, v) => v !== undefined && v !== null && v !== '')
  @IsDateString({}, { message: MESSAGES.TASK_VALIDATION.DUE_AT_INVALID })
  dueAt?: string | null;

  @ApiProperty({
    example: '<p>Patch drywall in unit 12B</p>',
    description:
      'Action item description as safe HTML (subset: p, br, strong/b, em/i, ul/ol/li). Must contain at least 3 non-whitespace characters of visible text after stripping tags.',
  })
  @IsString({ message: MESSAGES.TASK_VALIDATION.DESCRIPTION_REQUIRED })
  @Validate(IsRichTaskDescriptionConstraint)
  description!: string;

  @ApiPropertyOptional({ description: 'Internal notes (optional).' })
  @IsOptional()
  @IsString()
  notes?: string;
}
