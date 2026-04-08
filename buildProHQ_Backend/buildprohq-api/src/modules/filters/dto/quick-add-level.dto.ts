import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength, MinLength } from 'class-validator';

export class QuickAddLevelDto {
  @ApiProperty({ example: 'L11', description: 'Display name for the new level' })
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  levelName!: string;
}
