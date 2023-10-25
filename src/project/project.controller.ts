import { Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { OptionalIntPipe } from '../../utils/decorators/optional-int.pipe';
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

  @Delete(':id')
  deleteProject(@Param('id', new OptionalIntPipe()) id: number) {
    return this.projectService.deleteProject(id);
  }
}
