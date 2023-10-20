import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateLinkReqDto {
  @IsString()
  @ApiProperty({ required: true })
  name: string;

  @IsString()
  @ApiProperty({ required: true })
  href: string;
}
