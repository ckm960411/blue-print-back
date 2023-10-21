import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class MilestoneService {
  constructor(private prisma: PrismaService) {}
}
