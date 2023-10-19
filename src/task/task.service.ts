import { Injectable } from '@nestjs/common';
import { addDays, formatISO } from 'date-fns';
import { pipe, uniqBy, flatten } from 'lodash/fp';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTaskReqDto } from './dto/create-task.req.dto';

@Injectable()
export class TaskService {
  constructor(private prisma: PrismaService) {}

  async findAllTasks() {
    const tasks = await Promise.all([
      this.findOnlyPriorityFiveTasks(),
      this.findNearDeadlineTasks(),
      this.findOnlyBookmarkedTasks(),
      this.findAllMemosOrderByCraetedAt(),
    ]);
    return pipe(flatten, uniqBy('id'))(tasks);
  }

  findOnlyPriorityFiveTasks() {
    return this.prisma.task.findMany({
      where: { deletedAt: null, priority: 5 },
      orderBy: { createdAt: 'asc' },
    });
  }

  findNearDeadlineTasks() {
    const now = new Date();
    const twoDaysLater = addDays(now, 2);

    return this.prisma.task.findMany({
      where: {
        deletedAt: null,
        endAt: {
          gte: formatISO(now),
          lte: formatISO(twoDaysLater),
        },
      },
      orderBy: { createdAt: 'asc' },
    });
  }

  findOnlyBookmarkedTasks() {
    return this.prisma.task.findMany({
      where: { deletedAt: null, isBookmarked: true },
      orderBy: { createdAt: 'asc' },
    });
  }

  findAllMemosOrderByCraetedAt() {
    return this.prisma.task.findMany({
      where: { deletedAt: null },
      orderBy: { createdAt: 'asc' },
    });
  }

  createTask(createTaskReqDto: CreateTaskReqDto) {
    return this.prisma.task.create({ data: createTaskReqDto });
  }
}
