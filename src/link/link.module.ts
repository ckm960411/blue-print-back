import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { LinkController } from './link.controller';
import { LinkService } from './link.service';

@Module({
  controllers: [LinkController],
  providers: [LinkService],
  imports: [PrismaModule],
})
export class LinkModule {}
