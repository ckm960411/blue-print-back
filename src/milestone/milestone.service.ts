import { Injectable } from '@nestjs/common';
import { Milestone } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

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
    });
  }

  async createMilestone() {
    return this.prisma.milestone.create({
      data: {} as Milestone,
    });
  }
}
