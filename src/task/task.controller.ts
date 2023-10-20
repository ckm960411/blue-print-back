import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ProgressStatus } from '@prisma/client';
import { CreateTaskReqDto } from './dto/create-task.req.dto';
import { UpdateTaskReqDto } from './dto/update-task.req.dto';
import { TaskService } from './task.service';

@Controller('task')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Get()
  getAllTasks(@Query('progress') progress: ProgressStatus) {
    return this.taskService.findAllTasks(progress);
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
}
