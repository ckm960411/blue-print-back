import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class MemoService {
  constructor(private prisma: PrismaService) {}

  findAllMemos() {
    return this.prisma.memo.findMany();
  }
}
