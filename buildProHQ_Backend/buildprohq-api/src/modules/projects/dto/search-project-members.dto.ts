import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsIn, IsInt, IsOptional, IsString, IsUUID, Max, MaxLength, Min } from 'class-validator';

const ROLE_FILTER = ['super_admin', 'manager', 'trade_user', 'field_user'] as const;
type RoleFilter = (typeof ROLE_FILTER)[number];

export class SearchProjectMembersDto {
  @ApiProperty({ example: 1 })
  @Transform(({ value }) => Number(value))
  @IsInt()
  @Min(1)
  page!: number;

  @ApiProperty({ example: 20 })
  @Transform(({ value }) => Number(value))
  @IsInt()
  @Min(1)
  @Max(100)
  limit!: number;

  @ApiProperty({ required: false, example: 'Rob' })
  @IsOptional()
  @IsString()
  @MaxLength(120)
  search?: string;

  @ApiProperty({ required: false, enum: ROLE_FILTER, example: 'manager' })
  @IsOptional()
  @IsIn(ROLE_FILTER)
  role?: RoleFilter;
}

export class AssignProjectMemberDto {
  @ApiProperty({ example: 'b0d31f13-7363-47e2-835c-ae815b892b49' })
  @IsUUID('4')
  userId!: string;

  @ApiProperty({ required: false, example: 'Manager' })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  projectRole?: string;
}

