import { Injectable, NotFoundException } from '@nestjs/common';
import { ProgressStatus } from '@prisma/client';
import { addDays, formatISO } from 'date-fns';
import { pipe, uniqBy, flatten } from 'lodash/fp';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTaskReqDto } from './dto/create-task.req.dto';
import { UpdateTaskReqDto } from './dto/update-task.req.dto';

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

  async findOnlyPriorityFiveTasks(progress?: ProgressStatus) {
    return this.prisma.task.findMany({
      where: {
        deletedAt: null,
        priority: 5,
        progress,
      },
      include: {
        links: true,
        tags: { orderBy: { id: 'asc' } },
      },
      orderBy: { createdAt: 'asc' },
    });
  }

  // 이틀 내로 남거나 지난 태스크들을 가져옴
  async findNearDeadlineTasks(progress?: ProgressStatus) {
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
      },
      include: {
        links: true,
        tags: { orderBy: { id: 'asc' } },
      },
      orderBy: { createdAt: 'asc' },
    });
  }

  async findOnlyBookmarkedTasks(progress?: ProgressStatus) {
    return this.prisma.task.findMany({
      where: {
        deletedAt: null,
        isBookmarked: true,
        progress,
      },
      include: {
        links: true,
        tags: { orderBy: { id: 'asc' } },
      },
      orderBy: { createdAt: 'asc' },
    });
  }

  async findAllMemosOrderByCreatedAt(progress?: ProgressStatus) {
    return this.prisma.task.findMany({
      where: { deletedAt: null, progress },
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
