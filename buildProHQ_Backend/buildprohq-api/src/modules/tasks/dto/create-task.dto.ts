import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsUUID, Validate } from 'class-validator';
import { MESSAGES } from '../../../infrastructure/common/constants/messages';
import { IsRichTaskDescriptionConstraint } from '../../../infrastructure/common/validators/rich-description.constraint';

export class CreateTaskDto {
  @ApiProperty({
    description: 'Task status id (use open status when creating a new action item).',
    example: '1b6a0fb1-2d3f-4f05-8c7f-5c9fdb1e3d42',
  })
  @IsUUID('4', { message: MESSAGES.TASK_VALIDATION.STATUS_ID_INVALID })
  statusId!: string;

  @ApiPropertyOptional({
    description: 'Priority id (optional; omit for no priority).',
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
  @IsOptional()
  @IsUUID('4', { message: MESSAGES.TASK_VALIDATION.ASSIGNED_USER_ID_INVALID })
  assignedToUserId?: string;

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
