import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class CommentTaskDto {
  @ApiProperty()
  @IsString()
  @MinLength(1)
  comment!: string;
}
