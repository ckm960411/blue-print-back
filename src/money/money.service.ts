import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMonthlyBudgetReqDto } from './dto/create-monthly-budget.req.dto';

@Injectable()
export class MoneyService {
  constructor(private prisma: PrismaService) {}

  async createMonthlyBudget(userId: number, data: CreateMonthlyBudgetReqDto) {
    return this.prisma.monthlyBudget.create({
      data: { userId, ...data },
    });
  }
}
