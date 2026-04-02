import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsUUID, MinLength } from 'class-validator';

export class CreateTaskDto {
  @ApiProperty()
  @IsUUID('4')
  statusId!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID('4')
  priorityId?: string;

  @ApiProperty()
  @IsUUID('4')
  levelId!: string;

  @ApiProperty()
  @IsUUID('4')
  tradeId!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID('4')
  assignedToUserId?: string;

  @ApiProperty()
  @IsString()
  @MinLength(3)
  description!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  notes?: string;
}
