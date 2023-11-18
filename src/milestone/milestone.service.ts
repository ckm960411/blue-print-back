import { Injectable } from '@nestjs/common';
import { Milestone, Prisma, ProgressStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateMilestoneReqDto } from './dto/update-milestone.req.dto';

@Injectable()
export class MilestoneService {
  constructor(private prisma: PrismaService) {}

  async findAllMilestoneList({
    projectId,
    progresses = [],
    page = 1,
    pageSize = 10,
  }: {
    projectId?: number;
    progresses?: ProgressStatus[];
    page?: number;
    pageSize?: number;
  }) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const twoDaysLater = new Date(today.getTime() + 2 * 24 * 60 * 60 * 1000);

    const items: Milestone[] = await this.prisma.$queryRaw`
      SELECT
        "Milestone".*,
        COUNT(DISTINCT "Memo"."id")::integer as "memoCount",
        COUNT(DISTINCT "Task"."id")::integer as "taskCount",
        COUNT(DISTINCT "Comment"."id")::integer as "commentCount"
        FROM "Milestone"
      LEFT JOIN "Memo" ON "Milestone"."id" = "Memo"."milestoneId"
      LEFT JOIN "Task" ON "Milestone"."id" = "Task"."milestoneId"
      LEFT JOIN "Comment" ON "Milestone"."id" = "Comment"."milestoneId"
      WHERE "Milestone"."progress"::text IN (${Prisma.join(progresses)})
      AND "Milestone"."projectId" = ${projectId}
      GROUP BY "Milestone"."id"
      ORDER BY
        CASE
          WHEN "Milestone"."priority" = 5 THEN 1
          WHEN "Milestone"."endAt" < ${twoDaysLater.toISOString()}::timestamp THEN 2
          WHEN "Milestone"."isBookmarked" = TRUE THEN 3
          WHEN "Milestone"."progress" != 'Completed' THEN 4
          ELSE 5
        END,
        "Milestone"."createdAt" DESC
      OFFSET ${(page - 1) * pageSize} ROWS
      FETCH NEXT ${pageSize} ROWS ONLY;
    `;

    const [{ count: totalCount }]: [{ count: number }] = await this.prisma
      .$queryRaw`
      SELECT COUNT(*)::integer FROM "Milestone"
      WHERE "progress"::text IN (${Prisma.join(progresses)});
    `;

    const totalPages = Math.ceil(totalCount / pageSize);
    const hasNext = page < totalPages;
    const hasPrev = page > 1;

    return {
      items,
      hasNext,
      hasPrev,
      currentPage: page,
      totalPages,
      totalCount,
    };
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
