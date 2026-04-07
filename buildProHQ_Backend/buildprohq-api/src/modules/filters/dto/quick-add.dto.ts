import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength, MinLength } from 'class-validator';

export class QuickAddDto {
  @ApiProperty({ example: 'L11' })
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  name!: string;
}

