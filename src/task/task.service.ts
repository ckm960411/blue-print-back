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

  findNearDeadlineTasks(progress?: ProgressStatus) {
    const now = new Date();
    const twoDaysLater = addDays(now, 2);

    return this.prisma.task.findMany({
      where: {
        deletedAt: null,
        endAt: {
          gte: formatISO(now),
          lte: formatISO(twoDaysLater),
        },
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
