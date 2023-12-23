import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { MoneyController } from './money.controller';
import { MoneyService } from './money.service';

@Module({
  controllers: [MoneyController],
  providers: [MoneyService],
  imports: [PrismaModule],
})
export class MoneyModule {}
