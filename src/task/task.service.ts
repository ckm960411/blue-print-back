import { Injectable } from '@nestjs/common';
import { ProgressStatus } from '@prisma/client';
import { addDays, formatISO } from 'date-fns';
import { pipe, uniqBy, flatten } from 'lodash/fp';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTaskReqDto } from './dto/create-task.req.dto';

@Injectable()
export class TaskService {
  constructor(private prisma: PrismaService) {}

  async findAllTasks(progress?: ProgressStatus) {
    const tasks = await Promise.all([
      this.findOnlyPriorityFiveTasks(progress),
      this.findNearDeadlineTasks(progress),
      this.findOnlyBookmarkedTasks(progress),
      this.findAllMemosOrderByCreatedAt(progress),
    ]);
    return pipe(flatten, uniqBy('id'))(tasks);
  }

  findOnlyPriorityFiveTasks(progress?: ProgressStatus) {
    return this.prisma.task.findMany({
      where: {
        deletedAt: null,
        priority: 5,
        progress,
      },
      orderBy: { createdAt: 'asc' },
    });
  }

  // 이틀 내로 남거나 지난 태스크들을 가져옴
  findNearDeadlineTasks(progress?: ProgressStatus) {
    // 오늘의 시작과 끝 시간 계산
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    // 이틀 후의 끝 시간 계산
    const twoDaysLaterEnd = addDays(todayEnd, 2);

    return this.prisma.task.findMany({
      where: {
        deletedAt: null,
        OR: [
          {
            endAt: {
              lte: formatISO(twoDaysLaterEnd),
              gte: formatISO(todayStart),
            },
          },
          {
            endAt: { lt: formatISO(todayStart) }, // 이미 지난 항목
          },
        ],
        progress,
      },
      orderBy: { createdAt: 'asc' },
    });
  }

  findOnlyBookmarkedTasks(progress?: ProgressStatus) {
    return this.prisma.task.findMany({
      where: {
        deletedAt: null,
        isBookmarked: true,
        progress,
      },
      orderBy: { createdAt: 'asc' },
    });
  }

  findAllMemosOrderByCreatedAt(progress?: ProgressStatus) {
    return this.prisma.task.findMany({
      where: { deletedAt: null, progress },
      orderBy: { createdAt: 'asc' },
    });
  }

  createTask(createTaskReqDto: CreateTaskReqDto) {
    return this.prisma.task.create({ data: createTaskReqDto });
  }
}
