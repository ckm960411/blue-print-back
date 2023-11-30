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

  async getThisMonthWorks(projectId: number, year?: number, month?: number) {
    const _year = year ?? new Date().getFullYear();
    const _month = month ? month - 1 : new Date().getMonth();

    const startDate = new Date(_year, _month, 1);
    const endDate = new Date(_year, _month + 1, 0);

    return this.prisma.$queryRaw`
      SELECT
        "Milestone"."id" as "milestoneId",
        NULL as "taskId",
        "Milestone"."title",
        "Milestone"."startAt",
        "Milestone"."endAt",
        "Milestone"."color",
        "Milestone"."priority",
        "Milestone"."progress",
        "Milestone"."unicode"
      FROM "Milestone"
      WHERE
        "Milestone"."projectId" = ${projectId} AND
        ("Milestone"."startAt" < ${startDate.toISOString()}::timestamp AND "Milestone"."endAt" >= ${startDate.toISOString()}::timestamp)
        OR ("Milestone"."startAt" >= ${startDate.toISOString()}::timestamp AND "Milestone"."endAt" <= ${endDate.toISOString()}::timestamp)
        OR ("Milestone"."startAt" <= ${endDate.toISOString()}::timestamp AND "Milestone"."endAt" > ${endDate.toISOString()}::timestamp)
        OR ("Milestone"."startAt" >= ${startDate.toISOString()}::timestamp AND "Milestone"."startAt" <= ${startDate.toISOString()}::timestamp)

      UNION ALL

      SELECT
        NULL as "milestoneId",
        "Task"."id" as "taskId",
        "Task"."title",
        "Task"."startAt",
        "Task"."endAt",
        "Task"."color",
        "Task"."priority",
        "Task"."progress",
        NULL as "unicode"
      FROM "Task"
      WHERE
        "Task"."projectId" = ${projectId} AND
        ("Task"."startAt" < ${startDate.toISOString()}::timestamp AND "Task"."endAt" >= ${startDate.toISOString()}::timestamp)
        OR ("Task"."startAt" >= ${startDate.toISOString()}::timestamp AND "Task"."endAt" <= ${endDate.toISOString()}::timestamp)
        OR ("Task"."startAt" <= ${endDate.toISOString()}::timestamp AND "Task"."endAt" > ${endDate.toISOString()}::timestamp)
        OR ("Task"."startAt" >= ${startDate.toISOString()}::timestamp AND "Task"."startAt" <= ${startDate.toISOString()}::timestamp)
    `;
  }
}
