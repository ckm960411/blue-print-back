import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMemoReqDto } from './dto/create-memo.req.dto';

@Injectable()
export class MemoService {
  constructor(private prisma: PrismaService) {}

  findAllMemos() {
    return this.prisma.memo.findMany({
      where: { deletedAt: null },
    });
  }

  createMemo(createMemoReqDto: CreateMemoReqDto) {
    const memo = this.prisma.memo.create({
      data: createMemoReqDto,
    });

    return memo;
  }

  deleteMemo(id: number) {
    const memo = this.prisma.memo.findUnique({
      where: { id, deletedAt: null },
    });

    if (!memo) {
      throw new NotFoundException('삭제하려는 메모가 존재하지 않습니다.');
    }

    return this.prisma.memo.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}
