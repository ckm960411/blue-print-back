import { ApiProperty } from '@nestjs/swagger';
import { ProgressStatus } from '@prisma/client';
import {
  IsBoolean,
  IsDateString,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class UpdateMilestoneReqDto {
  @IsDateString()
  @IsOptional()
  @ApiProperty({ required: false, type: 'Date' })
  startAt?: Date;

  @IsDateString()
  @IsOptional()
  @ApiProperty({ required: false, type: 'Date' })
  endAt?: Date;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false, type: 'string' })
  title?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false, type: 'string' })
  unicode?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false, type: 'string' })
  classification?: string;

  @IsNumber()
  @IsOptional()
  @ApiProperty({ required: false, type: '1 | 2 | 3 | 4 | 5' })
  priority?: 1 | 2 | 3 | 4 | 5;

  progress?: ProgressStatus;

  @IsBoolean()
  @IsOptional()
  @ApiProperty({ required: false, type: 'boolean' })
  isClosed?: boolean;

  @IsBoolean()
  @IsOptional()
  @ApiProperty({ required: false, type: 'boolean' })
  isBookmarked?: boolean;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false, type: 'string' })
  color?: string;

  @IsNumber()
  @IsOptional()
  @ApiProperty({ required: false })
  projectId?: number;
}
