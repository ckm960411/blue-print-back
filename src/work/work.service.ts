import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class WorkService {
  constructor(private prisma: PrismaService) {}

  async getWorkCount(projectId: number) {
    const milestoneCount = await this.prisma.milestone.count({
      where: { projectId },
    });
    const taskCount = await this.prisma.task.count({ where: { projectId } });
    const memoCount = await this.prisma.memo.count({ where: { projectId } });

    return {
      Milestone: milestoneCount,
      Task: taskCount,
      Memo: memoCount,
    };
  }
}
