import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsDateString,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class UpdateTaskReqDto {
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  @IsOptional()
  @ApiProperty({ required: false, minLength: 2, maxLength: 50 })
  title?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  description?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  content?: string;

  @IsDateString()
  @IsOptional()
  @ApiProperty({ required: false, type: 'Date' })
  startAt?: Date;

  @IsDateString()
  @IsOptional()
  @ApiProperty({ required: false, type: 'Date' })
  endAt?: Date;

  @IsNumber()
  @IsOptional()
  @ApiProperty({ required: false, type: '1 | 2 | 3 | 4| 5' })
  priority?: 1 | 2 | 3 | 4 | 5;

  @IsBoolean()
  @IsOptional()
  @ApiProperty({ required: false, type: 'boolean' })
  isBookmarked?: boolean;
}
