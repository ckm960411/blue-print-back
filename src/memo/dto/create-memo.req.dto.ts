import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateMemoReqDto {
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  @ApiProperty({ required: true })
  title: string;

  @IsString()
  @MinLength(2)
  @ApiProperty({ required: true })
  content: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false, example: '#001487' })
  color?: string;
}
