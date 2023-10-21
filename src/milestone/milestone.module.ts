import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { MilestoneController } from './milestone.controller';
import { MilestoneService } from './milestone.service';

@Module({
  controllers: [MilestoneController],
  providers: [MilestoneService],
  imports: [PrismaModule],
})
export class MilestoneModule {}
