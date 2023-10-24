import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProjectReqDto } from './dto/create-project.req.dto';

@Injectable()
export class ProjectService {
  constructor(private prisma: PrismaService) {}

  async createProject() {
    return this.prisma.project.create({
      data: {} as CreateProjectReqDto,
    });
  }
}
