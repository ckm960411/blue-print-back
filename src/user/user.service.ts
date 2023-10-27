import { Injectable } from '@nestjs/common';
import { Role } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserReqDto } from './dto/create-user.req.dto';
import * as bcrypt from 'bcrypt';

export const roundsOfHasing = 10;

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async createUser(createUserReqDto: CreateUserReqDto) {
    const hashedPassword = await bcrypt.hash(
      createUserReqDto.password,
      roundsOfHasing,
    );

    createUserReqDto.password = hashedPassword;
    createUserReqDto.role = Role.GUEST;

    return this.prisma.user.create({
      data: createUserReqDto,
    });
  }

  async findUser(id: number) {
    return this.prisma.user.findUnique({ where: { id } });
  }
}
