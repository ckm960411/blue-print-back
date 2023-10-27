import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class LoginReqDto {
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({ required: true, type: 'email' })
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  @ApiProperty({ required: true, type: 'string', minLength: 6 })
  password: string;
}
