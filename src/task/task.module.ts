import { Module } from '@nestjs/common';
import { LinkController } from '../link/link.controller';
import { LinkModule } from '../link/link.module';
import { PrismaModule } from '../prisma/prisma.module';
import { TaskController } from './task.controller';
import { TaskService } from './task.service';

@Module({
  controllers: [TaskController, LinkController],
  providers: [TaskService],
  imports: [PrismaModule, LinkModule],
})
export class TaskModule {}
