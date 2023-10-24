import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class UpdateMemoReqDto {
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  @IsOptional()
  @ApiProperty({ required: false })
  title?: string;

  @IsString()
  @MinLength(2)
  @IsOptional()
  @ApiProperty({ required: false })
  content?: string;

  @IsBoolean()
  @IsOptional()
  @ApiProperty({ required: false })
  isChecked?: boolean;

  @IsBoolean()
  @IsOptional()
  @ApiProperty({ required: false })
  isBookmarked?: boolean;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  color?: string;

  @IsNumber()
  @IsOptional()
  @ApiProperty({ required: false })
  projectId?: number;
}
