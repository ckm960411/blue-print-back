import { Injectable } from '@nestjs/common';
import { Milestone } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class MilestoneService {
  constructor(private prisma: PrismaService) {}

  async createMilestone() {
    return this.prisma.milestone.create({
      data: {} as Milestone,
    });
  }
}
