import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
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
import { UserModule } from './user/user.module';
import { NotionModule } from './notion/notion.module';
import { CommentModule } from './comment/comment.module';
import { WorkModule } from './work/work.module';
import { HealthModule } from './health/health.module';
import { MoneyModule } from './money/money.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    PrismaModule,
    TaskModule,
    MemoModule,
    LinkModule,
    TagModule,
    MilestoneModule,
    ProjectModule,
    AuthModule,
    UserModule,
    NotionModule,
    CommentModule,
    WorkModule,
    HealthModule,
    MoneyModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
