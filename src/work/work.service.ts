import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class WorkService {
  constructor(private prisma: PrismaService) {}
}
