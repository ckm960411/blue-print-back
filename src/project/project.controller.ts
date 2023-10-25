import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { OptionalIntPipe } from '../../utils/decorators/optional-int.pipe';
import { CreateProjectReqDto } from './dto/create-project.req.dto';
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

  @Patch(':id')
  updateProject(
    @Param('id', new ParseIntPipe()) id: number,
    @Body() updateProjectReqDto: Partial<CreateProjectReqDto>,
  ) {
    return this.projectService.updateProject(id, updateProjectReqDto);
  }

  @Delete(':id')
  deleteProject(@Param('id', new OptionalIntPipe()) id: number) {
    return this.projectService.deleteProject(id);
  }
}
