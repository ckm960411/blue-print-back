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

  async findAllProjects() {
    return this.prisma.project.findMany({
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

  async deleteProject(id: number) {
    return this.prisma.project.delete({ where: { id } });
  }
}
