import { Controller, Get, Post } from '@nestjs/common';
import { ProjectService } from './project.service';

@Controller('project')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Get()
  async findAllProjects() {
    return this.projectService.findAllProjects();
  }

  @Post()
  createProject() {
    return this.projectService.createProject();
  }
}
