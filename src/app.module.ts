import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { TaskModule } from './task/task.module';
import { MemoModule } from './memo/memo.module';

@Module({
  imports: [PrismaModule, TaskModule, MemoModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
