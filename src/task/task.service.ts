import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma, ProgressStatus } from '@prisma/client';
import { endOfMonth, getMonth, getYear, startOfMonth } from 'date-fns';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTaskReqDto } from './dto/create-task.req.dto';
import { UpdateTaskReqDto } from './dto/update-task.req.dto';

@Injectable()
export class TaskService {
  constructor(private prisma: PrismaService) {}

  async findAllTasks(projectId: number, milestoneId?: number) {
    const { ToDo, InProgress, Review, Completed } = ProgressStatus;
    const todoTasks = await this.getTasks({
      projectId,
      progress: ToDo,
      milestoneId,
    });
    const inProgressTasks = await this.getTasks({
      projectId,
      progress: InProgress,
      milestoneId,
    });
    const reviewTasks = await this.getTasks({
      projectId,
      progress: Review,
      milestoneId,
    });
    const completedTasks = await this.getTasks({
      projectId,
      progress: Completed,
      milestoneId,
    });

    return {
      [ToDo]: todoTasks,
      [InProgress]: inProgressTasks,
      [Review]: reviewTasks,
      [Completed]: completedTasks,
    };
  }

  async getTasks({
    projectId,
    progress,
    milestoneId,
  }: {
    projectId: number;
    progress: ProgressStatus;
    milestoneId?: number;
  }) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const twoDaysLater = new Date(today.getTime() + 2 * 24 * 60 * 60 * 1000);

    return this.prisma.$queryRaw`
        SELECT "Task".*,
          "Milestone"."title" as "milestoneTitle",
          "Milestone"."color" as "milestoneColor",
          COALESCE(array_agg("Tag"."name") FILTER (WHERE "Tag"."name" IS NOT NULL), ARRAY[]::VARCHAR[]) as tags
          FROM "Task"
        LEFT JOIN "Milestone" ON "Task"."milestoneId" = "Milestone"."id"
        LEFT JOIN "Tag" ON "Task"."id" = "Tag"."taskId"
        WHERE "Task"."progress"::text = ${progress}
          AND "Task"."projectId" = ${projectId}
          ${
            milestoneId
              ? Prisma.sql`AND "Task"."milestoneId" = ${milestoneId}`
              : Prisma.empty
          }
        GROUP BY "Task"."id", "Milestone"."title", "Milestone"."color"
        ORDER BY
          CASE
            WHEN "Task"."priority" = 5 THEN 1
            WHEN "Task"."endAt" < ${twoDaysLater.toISOString()}::timestamp THEN 2
            WHEN "Task"."isBookmarked" = TRUE THEN 3
            ELSE 4
          END,
          "Task"."createdAt" DESC;
      `;
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
