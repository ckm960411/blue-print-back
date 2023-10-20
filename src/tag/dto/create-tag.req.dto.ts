import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString, MinLength } from 'class-validator';

export class CreateTagReqDto {
  @IsString()
  @MinLength(1)
  @ApiProperty({ required: true, minLength: 1 })
  name: string;

  @IsString()
  @ApiProperty({ required: true, example: 'blue' })
  color: string;

  @IsNumber()
  @IsOptional()
  @ApiProperty({ required: false, type: 'number' })
  taskId?: number;

  @IsNumber()
  @IsOptional()
  @ApiProperty({ required: false, type: 'number' })
  milestoneId?: number;
}
