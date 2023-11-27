import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { WorkController } from './work.controller';
import { WorkService } from './work.service';

@Module({
  controllers: [WorkController],
  providers: [WorkService],
  imports: [PrismaModule],
})
export class WorkModule {}
