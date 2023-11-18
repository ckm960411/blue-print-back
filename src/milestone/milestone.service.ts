import { Injectable } from '@nestjs/common';
import { Milestone, ProgressStatus } from '@prisma/client';
import { addDays, formatISO } from 'date-fns';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateMilestoneReqDto } from './dto/update-milestone.req.dto';
import { pipe, uniqBy, flatten } from 'lodash/fp';

@Injectable()
export class MilestoneService {
  constructor(private prisma: PrismaService) {}

  async findAllMilestones(progresses?: ProgressStatus[], projectId?: number) {
    const milestones = await Promise.all([
      this.findOnlyPriorityFiveMilestones(progresses, projectId),
      this.findNearDeadlineMilestones(progresses, projectId),
      this.findOnlyBookmarkedMilestones(progresses, projectId),
      this.findAllMilestonesByCreatedAt(progresses, projectId),
    ]);
    return pipe(flatten, uniqBy('id'))(milestones);
  }

  async findOnlyPriorityFiveMilestones(
    progresses?: ProgressStatus[],
    projectId?: number,
  ) {
    return this.prisma.milestone.findMany({
      where: {
        deletedAt: null,
        priority: 5,
        progress: { in: progresses },
        projectId,
      },
      include: {
        tags: { orderBy: { id: 'asc' } },
        links: true,
        tasks: true,
        memos: true,
      },
      orderBy: { createdAt: 'asc' },
    });
  }

  // 이틀 내로 남거나 지난 마일스톤들을 가져옴
  async findNearDeadlineMilestones(
    progresses?: ProgressStatus[],
    projectId?: number,
  ) {
    // 오늘의 시작과 끝 시간 계산
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    // 이틀 후의 끝 시간 계산
    const twoDaysLaterEnd = addDays(todayEnd, 2);

    return this.prisma.milestone.findMany({
      where: {
        deletedAt: null,
        OR: [
          {
            endAt: {
              lte: formatISO(twoDaysLaterEnd),
              gte: formatISO(todayStart),
            },
          },
          // 이미 지난 항목
          { endAt: { lt: formatISO(todayStart) } },
        ],
        progress: { in: progresses },
        projectId,
      },
      include: {
        tags: { orderBy: { id: 'asc' } },
        links: true,
        tasks: true,
        memos: true,
      },
      orderBy: { createdAt: 'asc' },
    });
  }

  async findOnlyBookmarkedMilestones(
    progresses?: ProgressStatus[],
    projectId?: number,
  ) {
    return this.prisma.milestone.findMany({
      where: {
        deletedAt: null,
        isBookmarked: true,
        progress: { in: progresses },
        projectId,
      },
      include: {
        tags: { orderBy: { id: 'asc' } },
        links: true,
        tasks: true,
        memos: true,
      },
      orderBy: { createdAt: 'asc' },
    });
  }

  async findAllMilestonesByCreatedAt(
    progresses?: ProgressStatus[],
    projectId?: number,
  ) {
    return this.prisma.milestone.findMany({
      where: {
        deletedAt: null,
        progress: { in: progresses },
        projectId,
      },
      include: {
        tags: { orderBy: { id: 'asc' } },
        links: true,
        tasks: true,
        memos: true,
      },
      orderBy: { createdAt: 'asc' },
    });
  }

  async findMilestoneById(id: number) {
    const milestone = await this.prisma.milestone.findUnique({
      where: { id },
      include: {
        tags: { orderBy: { id: 'asc' } },
        links: true,
        tasks: true,
        memos: true,
      },
    });
    return milestone;
  }

  async createMilestone(projectId?: number) {
    return this.prisma.milestone.create({
      data: { projectId } as Milestone,
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

  async deleteMilestone(id: number) {
    return this.prisma.milestone.delete({ where: { id } });
  }
}
