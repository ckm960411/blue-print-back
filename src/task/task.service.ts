import { Injectable, NotFoundException } from '@nestjs/common';
import { ProgressStatus } from '@prisma/client';
import {
  addDays,
  endOfMonth,
  formatISO,
  getMonth,
  getYear,
  startOfMonth,
} from 'date-fns';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTaskReqDto } from './dto/create-task.req.dto';
import { UpdateTaskReqDto } from './dto/update-task.req.dto';

@Injectable()
export class TaskService {
  constructor(private prisma: PrismaService) {}

  async findAllTasks(projectId: number) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const twoDaysLater = new Date(today.getTime() + 2 * 24 * 60 * 60 * 1000);

    const getTasks = async (progress: ProgressStatus) => {
      return this.prisma.$queryRaw`
        SELECT "Task".*,
          "Milestone"."title" as "milestoneTitle"
          FROM "Task"
        LEFT JOIN "Milestone" ON "Task"."milestoneId" = "Milestone"."id"
        WHERE "Task"."progress"::text = ${progress}
          AND "Task"."projectId" = ${projectId}
        ORDER BY
          CASE
            WHEN "Task"."priority" = 5 THEN 1
            WHEN "Task"."endAt" < ${twoDaysLater.toISOString()}::timestamp THEN 2
            WHEN "Task"."isBookmarked" = TRUE THEN 3
            ELSE 4
          END,
          "Task"."createdAt" DESC;
      `;
    };

    const todoTasks = await getTasks(ProgressStatus.ToDo);
    const inProgressTasks = await getTasks(ProgressStatus.InProgress);
    const reviewTasks = await getTasks(ProgressStatus.Review);
    const completedTasks = await getTasks(ProgressStatus.Completed);

    return {
      [ProgressStatus.ToDo]: todoTasks,
      [ProgressStatus.InProgress]: inProgressTasks,
      [ProgressStatus.Review]: reviewTasks,
      [ProgressStatus.Completed]: completedTasks,
    };
  }

  async findOnlyPriorityFiveTasks(
    progress?: ProgressStatus,
    projectId?: number,
    milestoneId?: number,
  ) {
    return this.prisma.task.findMany({
      where: {
        deletedAt: null,
        priority: 5,
        progress,
        milestoneId,
        projectId,
      },
      include: {
        links: true,
        tags: { orderBy: { id: 'asc' } },
      },
      orderBy: { createdAt: 'asc' },
    });
  }

  // 이틀 내로 남거나 지난 태스크들을 가져옴
  async findNearDeadlineTasks(
    progress?: ProgressStatus,
    projectId?: number,
    milestoneId?: number,
  ) {
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
        projectId,
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
    projectId?: number,
    milestoneId?: number,
  ) {
    return this.prisma.task.findMany({
      where: {
        deletedAt: null,
        isBookmarked: true,
        progress,
        milestoneId,
        projectId,
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
    projectId?: number,
    milestoneId?: number,
  ) {
    return this.prisma.task.findMany({
      where: { deletedAt: null, progress, milestoneId, projectId },
      include: {
        links: true,
        tags: { orderBy: { id: 'asc' } },
      },
      orderBy: { createdAt: 'asc' },
    });
  }

  async findOneTask(id: number, projectId?: number) {
    const task = await this.prisma.task.findUnique({
      where: { id, deletedAt: null, projectId },
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

  async findAllUrgentTasks(projectId?: number, milestoneId?: number) {
    const tasks = await this.prisma.task.findMany({
      where: {
        deletedAt: null,
        progress: {
          not: ProgressStatus.Completed,
        },
        priority: 5,
        milestoneId,
        projectId,
      },
      include: {
        links: true,
        tags: { orderBy: { id: 'asc' } },
      },
    });
    return tasks;
  }

  async findThisMonthTasks(projectId?: number, year?: number, month?: number) {
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
        projectId,
        OR: [
          { startAt: { gte: firstDayOfMonth, lte: lastDayOfMonth } },
          { endAt: { gte: firstDayOfMonth, lte: lastDayOfMonth } },
          {
            AND: [
              { startAt: { lte: lastDayOfMonth } },
              { endAt: { gte: firstDayOfMonth } },
            ],
          },
        ],
      },
      orderBy: [{ startAt: 'asc' }, { id: 'asc' }],
    });

    return data;
  }

  async createTask(createTaskReqDto: CreateTaskReqDto) {
    return this.prisma.task.create({ data: createTaskReqDto });
  }

  async updateTask(id: number, updateTaskReqDto: UpdateTaskReqDto) {
    const task = await this.findOneTask(id, updateTaskReqDto?.projectId);

    return this.prisma.task.update({
      where: { id: task.id },
      data: updateTaskReqDto,
    });
  }

  async deleteTask(id: number) {
    return this.prisma.task.delete({ where: { id } });
  }
}
