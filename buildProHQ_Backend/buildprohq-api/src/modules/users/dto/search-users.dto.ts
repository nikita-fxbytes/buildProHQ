import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsIn, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

export class SearchUsersDto {
  @ApiPropertyOptional({ default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page = 1;

  @ApiPropertyOptional({ default: 10, maximum: 100 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit = 10;

  @ApiPropertyOptional({
    description: 'Search term (name/email/role/initials)',
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({
    description: 'Role filter (maps to user type)',
    enum: ['User', 'Trade', 'Management'],
  })
  @IsOptional()
  @IsIn(['User', 'Trade', 'Management'])
  role?: 'User' | 'Trade' | 'Management';

  @ApiPropertyOptional({
    description: 'Sort column',
    enum: ['createdAt', 'name', 'email', 'role', 'tasks', 'lastLoginAt'],
  })
  @IsOptional()
  @IsIn(['createdAt', 'name', 'email', 'role', 'tasks', 'lastLoginAt'])
  sortBy?: 'createdAt' | 'name' | 'email' | 'role' | 'tasks' | 'lastLoginAt';

  @ApiPropertyOptional({ description: 'Sort order', enum: ['asc', 'desc'] })
  @IsOptional()
  @IsIn(['asc', 'desc'])
  sortOrder?: 'asc' | 'desc';
}
