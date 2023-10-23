import { Injectable, NotFoundException } from '@nestjs/common';
import { ProgressStatus } from '@prisma/client';
import {
  addDays,
  endOfMonth,
  formatISO,
  getMonth,
  getYear,
  lastDayOfMonth,
  startOfMonth,
} from 'date-fns';
import { pipe, uniqBy, flatten } from 'lodash/fp';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTaskReqDto } from './dto/create-task.req.dto';
import { UpdateTaskReqDto } from './dto/update-task.req.dto';

@Injectable()
export class TaskService {
  constructor(private prisma: PrismaService) {}

  async findAllTasks(progress?: ProgressStatus, milestoneId?: number) {
    const tasks = await Promise.all([
      this.findOnlyPriorityFiveTasks(progress, milestoneId),
      this.findNearDeadlineTasks(progress, milestoneId),
      this.findOnlyBookmarkedTasks(progress, milestoneId),
      this.findAllTasksOrderByCreatedAt(progress, milestoneId),
    ]);
    return pipe(flatten, uniqBy('id'))(tasks);
  }

  async findOnlyPriorityFiveTasks(
    progress?: ProgressStatus,
    milestoneId?: number,
  ) {
    return this.prisma.task.findMany({
      where: {
        deletedAt: null,
        priority: 5,
        progress,
        milestoneId,
      },
      include: {
        links: true,
        tags: { orderBy: { id: 'asc' } },
      },
      orderBy: { createdAt: 'asc' },
    });
  }

  // 이틀 내로 남거나 지난 태스크들을 가져옴
  async findNearDeadlineTasks(progress?: ProgressStatus, milestoneId?: number) {
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
          // 이미 지난 항목
          { endAt: { lt: formatISO(todayStart) } },
        ],
        progress,
        milestoneId,
      },
      include: {
        links: true,
        tags: { orderBy: { id: 'asc' } },
      },
      orderBy: { createdAt: 'asc' },
    });
  }

  async findOnlyBookmarkedTasks(
    progress?: ProgressStatus,
    milestoneId?: number,
  ) {
    return this.prisma.task.findMany({
      where: {
        deletedAt: null,
        isBookmarked: true,
        progress,
        milestoneId,
      },
      include: {
        links: true,
        tags: { orderBy: { id: 'asc' } },
      },
      orderBy: { createdAt: 'asc' },
    });
  }

  async findAllTasksOrderByCreatedAt(
    progress?: ProgressStatus,
    milestoneId?: number,
  ) {
    return this.prisma.task.findMany({
      where: { deletedAt: null, progress, milestoneId },
      include: {
        links: true,
        tags: { orderBy: { id: 'asc' } },
      },
      orderBy: { createdAt: 'asc' },
    });
  }

  async findOneTask(id: number) {
    const task = await this.prisma.task.findUnique({
      where: { id, deletedAt: null },
      include: {
        links: true,
        tags: { orderBy: { id: 'asc' } },
      },
    });

    if (!task) {
      throw new NotFoundException('찾는 태스크가 존재하지 않습니다.');
    }

    return task;
  }

  async findAllUrgentTasks(milestoneId?: number) {
    const tasks = await this.prisma.task.findMany({
      where: {
        deletedAt: null,
        progress: {
          not: ProgressStatus.Completed,
        },
        priority: 5,
        milestoneId,
      },
      include: {
        links: true,
        tags: { orderBy: { id: 'asc' } },
      },
    });
    return tasks;
  }

  async findThisMonthTasks(year?: number, month?: number) {
    const _year = year ?? getYear(new Date());
    const _month = month ? month - 1 : getMonth(new Date());
    const date = new Date(_year, _month);
    const firstDayOfMonth = startOfMonth(date);
    const lastDayOfMonth = endOfMonth(date);

    const data = await this.prisma.task.findMany({
      where: {
        deletedAt: null,
        progress: {
          not: ProgressStatus.Completed,
        },
        OR: [
          { startAt: { gte: firstDayOfMonth, lte: lastDayOfMonth } },
          { endAt: { gte: firstDayOfMonth, lte: lastDayOfMonth } },
        ],
      },
    });

    return data;
  }

  async createTask(createTaskReqDto: CreateTaskReqDto) {
    return this.prisma.task.create({ data: createTaskReqDto });
  }

  async updateTask(id: number, updateTaskReqDto: UpdateTaskReqDto) {
    const task = await this.findOneTask(id);

    return this.prisma.task.update({
      where: { id: task.id },
      data: updateTaskReqDto,
    });
  }

  async deleteTask(id: number) {
    return this.prisma.task.delete({ where: { id } });
  }
}
