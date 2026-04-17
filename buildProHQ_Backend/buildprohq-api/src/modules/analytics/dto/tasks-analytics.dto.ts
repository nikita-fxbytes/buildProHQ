import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsDateString,
  IsOptional,
  IsUUID,
  ValidateNested,
} from 'class-validator';

class DateRangeDto {
  @ApiPropertyOptional({ example: '2026-04-01' })
  @IsOptional()
  @IsDateString()
  from?: string;

  @ApiPropertyOptional({ example: '2026-04-30' })
  @IsOptional()
  @IsDateString()
  to?: string;
}

export class TasksAnalyticsDto {
  @ApiProperty({
    description: 'Project id to scope analytics to.',
    example: '15004760-efa3-406e-9a24-18a6c64f8d51',
  })
  @IsUUID('4')
  projectId!: string;

  @ApiPropertyOptional({ type: DateRangeDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => DateRangeDto)
  dateRange?: DateRangeDto;
}
