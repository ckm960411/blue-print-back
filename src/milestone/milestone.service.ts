import { Injectable } from '@nestjs/common';
import { Milestone } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateMilestoneReqDto } from './dto/update-milestone.req.dto';

@Injectable()
export class MilestoneService {
  constructor(private prisma: PrismaService) {}

  async findAllMilestones() {
    return this.prisma.milestone.findMany({
      where: { deletedAt: null },
      include: {
        tags: true,
        links: true,
        tasks: true,
        memos: true,
      },
      orderBy: { createdAt: 'asc' },
    });
  }

  async createMilestone() {
    return this.prisma.milestone.create({
      data: {} as Milestone,
    });
  }

  async updateMilestone(
    id: number,
    updateMilestoneReqDto: UpdateMilestoneReqDto,
  ) {
    return this.prisma.milestone.update({
      where: { id },
      data: updateMilestoneReqDto,
    });
  }
}
