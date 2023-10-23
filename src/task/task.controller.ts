import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ProgressStatus } from '@prisma/client';
import { OptionalIntPipe } from '../../utils/decorators/optional-int.pipe';
import { CreateTaskReqDto } from './dto/create-task.req.dto';
import { UpdateTaskReqDto } from './dto/update-task.req.dto';
import { TaskService } from './task.service';

@Controller('task')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Get()
  getAllTasks(
    @Query('progress') progress: ProgressStatus,
    @Query('milestoneId', new OptionalIntPipe()) milestoneId?: number,
  ) {
    return this.taskService.findAllTasks(progress, milestoneId);
  }

  @Get('urgent')
  getAllUrgentTasks() {
    return this.taskService.findAllUrgentTasks();
  }

  @Post()
  createTask(@Body() createTaskReqDto: CreateTaskReqDto) {
    return this.taskService.createTask(createTaskReqDto);
  }

  @Patch(':id')
  updateTask(
    @Param('id', new ParseIntPipe()) id: number,
    @Body() updateTaskReqDto: UpdateTaskReqDto,
  ) {
    return this.taskService.updateTask(id, updateTaskReqDto);
  }

  @Delete(':id')
  deleteTask(@Param('id', new ParseIntPipe()) id: number) {
    return this.taskService.deleteTask(id);
  }
}
