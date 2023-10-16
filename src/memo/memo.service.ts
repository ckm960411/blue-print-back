import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMemoReqDto } from './dto/create-memo.req.dto';

@Injectable()
export class MemoService {
  constructor(private prisma: PrismaService) {}

  findAllMemos() {
    return this.prisma.memo.findMany();
  }

  createMemo(createMemoReqDto: CreateMemoReqDto) {
    return this.prisma.memo.create({
      data: createMemoReqDto,
    });
  }
}
