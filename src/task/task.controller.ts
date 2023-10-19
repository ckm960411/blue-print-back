import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ProgressStatus } from '@prisma/client';
import { CreateTaskReqDto } from './dto/create-task.req.dto';
import { TaskService } from './task.service';

@Controller('task')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Get()
  getAllTasks(@Query('progress') progress: ProgressStatus) {
    console.log('progress: ', progress);
    return this.taskService.findAllTasks(progress);
  }

  @Post()
  createTask(@Body() createTaskReqDto: CreateTaskReqDto) {
    return this.taskService.createTask(createTaskReqDto);
  }
}
