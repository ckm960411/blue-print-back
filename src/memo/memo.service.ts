import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMemoReqDto } from './dto/create-memo.req.dto';
import { UpdateMemoReqDto } from './dto/update-memo.req.dto';

@Injectable()
export class MemoService {
  constructor(private prisma: PrismaService) {}

  async findAllMemos(checked = false) {
    return this.prisma.memo.findMany({
      where: { deletedAt: null, isChecked: checked || undefined },
      orderBy: [{ isBookmarked: 'desc' }, { createdAt: 'desc' }],
    });
  }

  async findOneMemo(id: number) {
    const memo = await this.prisma.memo.findUnique({
      where: { id, deletedAt: null },
    });

    if (!memo) {
      throw new NotFoundException(
        '찾는 메모가 존재하지 않거나 삭제되었습니다.',
      );
    }

    return memo;
  }

  async createMemo(createMemoReqDto: CreateMemoReqDto) {
    const memo = await this.prisma.memo.create({
      data: createMemoReqDto,
    });

    return memo;
  }

  async updateMemo(id: number, updateMemoReqDto: UpdateMemoReqDto) {
    const memo = await this.findOneMemo(id);

    return this.prisma.memo.update({
      where: { id: memo.id },
      data: updateMemoReqDto,
    });
  }

  async deleteMemo(id: number) {
    const memo = await this.findOneMemo(id);

    return this.prisma.memo.update({
      where: { id: memo.id },
      data: { deletedAt: new Date() },
    });
  }
}
