import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProjectReqDto } from './dto/create-project.req.dto';

@Injectable()
export class ProjectService {
  constructor(private prisma: PrismaService) {}

  async createProject(userId: number) {
    return this.prisma.project.create({
      data: { userId } as CreateProjectReqDto,
    });
  }

  async findAllProjects(userId: number) {
    return this.prisma.project.findMany({
      where: { userId },
      orderBy: { id: 'asc' },
    });
  }

  async updateProject(
    id: number,
    updateProjectReqDto: Partial<CreateProjectReqDto>,
  ) {
    return this.prisma.project.update({
      where: { id },
      data: updateProjectReqDto,
    });
  }

  async deleteProject(id: number, userId: number) {
    return this.prisma.project.delete({ where: { id, userId } });
  }
}
