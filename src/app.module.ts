import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { TaskModule } from './task/task.module';
import { MemoModule } from './memo/memo.module';
import { LinkModule } from './link/link.module';
import { TagModule } from './tag/tag.module';
import { MilestoneModule } from './milestone/milestone.module';
import { ProjectModule } from './project/project.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [PrismaModule, TaskModule, MemoModule, LinkModule, TagModule, MilestoneModule, ProjectModule, AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
