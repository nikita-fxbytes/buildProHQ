import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsUUID } from 'class-validator';

export class BulkTasksDto {
  @ApiProperty({ type: [String], description: 'List of task IDs for bulk operation' })
  @IsArray()
  @IsUUID('4', { each: true })
  ids: string[];
}
