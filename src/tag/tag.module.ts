import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { TagController } from './tag.controller';
import { TagService } from './tag.service';

@Module({
  controllers: [TagController],
  providers: [TagService],
  imports: [PrismaModule],
})
export class TagModule {}
