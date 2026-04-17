import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsArray,
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  MaxLength,
  Min,
} from 'class-validator';

const ROLE_FILTER = [
  'super_admin',
  'manager',
  'trade_user',
  'field_user',
] as const;
type RoleFilter = (typeof ROLE_FILTER)[number];

export class SearchProjectMembersDto {
  @ApiProperty({ required: false, example: 1, default: 1 })
  @Transform(({ value }) =>
    value === undefined || value === null || value === '' ? 1 : Number(value),
  )
  @IsOptional()
  @IsInt()
  @Min(1)
  page?: number;

  @ApiProperty({ required: false, example: 10, default: 10 })
  @Transform(({ value }) =>
    value === undefined || value === null || value === '' ? 10 : Number(value),
  )
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number;

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
  @ApiProperty({
    required: false,
    example: 'b0d31f13-7363-47e2-835c-ae815b892b49',
  })
  @IsOptional()
  @IsUUID('4')
  userId?: string;

  @ApiProperty({
    required: false,
    type: [String],
    example: ['b0d31f13-7363-47e2-835c-ae815b892b49'],
    description: 'Optional bulk assign. If provided, assigns all userIds.',
  })
  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true })
  userIds?: string[];

  @ApiProperty({ required: false, example: 'Manager' })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  projectRole?: string;
}
