import { Optional } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateProjectReqDto {
  @IsString()
  @Optional()
  @ApiProperty({ required: false })
  title?: string;

  @IsString()
  @Optional()
  @ApiProperty({ required: false })
  description?: string;
}
