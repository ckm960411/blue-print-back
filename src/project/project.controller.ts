import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { OptionalIntPipe } from '../../utils/decorators/optional-int.pipe';
import { User } from '../../utils/decorators/user.decorator';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { UserEntity } from '../user/entity/user.entity';
import { CreateProjectReqDto } from './dto/create-project.req.dto';
import { ProjectService } from './project.service';

@Controller('project')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async findAllProjects(@User() user: UserEntity) {
    return this.projectService.findAllProjects(user.id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  createProject(@User() user: UserEntity) {
    return this.projectService.createProject(user.id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  updateProject(
    @Param('id', new ParseIntPipe()) id: number,
    @Body() updateProjectReqDto: Partial<CreateProjectReqDto>,
  ) {
    return this.projectService.updateProject(id, updateProjectReqDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  deleteProject(
    @Param('id', new OptionalIntPipe()) id: number,
    @User() user: UserEntity,
  ) {
    return this.projectService.deleteProject(id, user.id);
  }
}
