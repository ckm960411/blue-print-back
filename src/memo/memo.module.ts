import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { MemoController } from './memo.controller';
import { MemoService } from './memo.service';

@Module({
  controllers: [MemoController],
  providers: [MemoService],
  imports: [PrismaModule],
})
export class MemoModule {}
