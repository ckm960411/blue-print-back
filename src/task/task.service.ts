import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTaskReqDto } from './dto/create-task.req.dto';

@Injectable()
export class TaskService {
  constructor(private prisma: PrismaService) {}

  findAllTasks() {
    return this.prisma.task.findMany();
  }

  createTask(createTaskReqDto: CreateTaskReqDto) {
    return this.prisma.task.create({ data: createTaskReqDto });
  }
}
