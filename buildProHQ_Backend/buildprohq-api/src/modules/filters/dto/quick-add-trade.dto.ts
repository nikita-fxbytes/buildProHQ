import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength, MinLength } from 'class-validator';

export class QuickAddTradeDto {
  @ApiProperty({ example: 'Tiler', description: 'Display name for the new trade' })
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  tradeName!: string;
}
