import { User } from '@prisma/client';
import { Exclude } from 'class-transformer';
import { IsEmail, IsNumber } from 'class-validator';

export class UserEntity {
  constructor(partial: Partial<UserEntity>) {
    Object.assign(this, partial);
  }

  @IsNumber()
  id: number;

  @IsEmail()
  email: string;

  @Exclude()
  password: string;
}
