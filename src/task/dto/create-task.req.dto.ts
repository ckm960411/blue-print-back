import { ApiProperty } from '@nestjs/swagger';
import {
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateTaskReqDto {
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  @ApiProperty({ required: true, minLength: 2, maxLength: 3 })
  title: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false, type: 'string' })
  description?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false, type: 'string' })
  content?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false, type: 'string' })
  color?: string;

  @IsNumber()
  @IsOptional()
  @ApiProperty({ required: false, type: 'number' })
  projectId?: number;
}
