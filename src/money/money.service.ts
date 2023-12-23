import { Injectable } from '@nestjs/common';
import {
  format,
  addMonths,
  getMonth,
  getYear,
  isBefore,
  isWeekend,
  addDays,
} from 'date-fns';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMonthlyBudgetReqDto } from './dto/create-monthly-budget.req.dto';

@Injectable()
export class MoneyService {
  constructor(private prisma: PrismaService) {}

  /**
   * @param userId userId
   * @param date yyyy-MM-dd
   */
  async getMonthlyBudget(userId: number, date: string) {
    const dateToFind = new Date(date);
    const year = getYear(dateToFind);
    const month = getMonth(dateToFind) + 1;

    const start = this.findMonthlyBudgetStartDay(year, month);
    const monthToFind = isBefore(dateToFind, start)
      ? getMonth(addMonths(dateToFind, -1)) + 1
      : month;

    return this.prisma.monthlyBudget.findFirst({
      where: { userId, month: monthToFind },
    });
  }

  async createMonthlyBudget(userId: number, data: CreateMonthlyBudgetReqDto) {
    const startDate = this.findMonthlyBudgetStartDay(data.year, data.month);
    const start = format(startDate, 'yyyy-MM-dd');
    const endDate = this.findMonthlyBudgetEndDay(data.year, data.month);
    const end = format(endDate, 'yyyy-MM-dd');

    return this.prisma.monthlyBudget.create({
      data: { userId, ...data, start, end, budget: data.budget ?? 0 },
    });
  }

  findMonthlyBudgetStartDay(year: number, month: number) {
    const is15DayWeekend = isWeekend(new Date(year, month - 1, 15));

    // 15일이 평일이라면 15일 반환
    if (!is15DayWeekend) return new Date(year, month - 1, 15);

    // 15일이 주말이라면 14일을, 14일도 주말이라면 13일 반환
    const is14DayWeekend = isWeekend(new Date(year, month - 1, 14));
    if (is14DayWeekend) {
      return new Date(year, month - 1, 13);
    }
    return new Date(year, month - 1, 14);
  }

  findMonthlyBudgetEndDay(year: number, month: number) {
    const dateToFind = new Date(year, month - 1);
    // 한달을 더함
    const dateMonthAdded = addMonths(dateToFind, 1);
    const yearAdded = getYear(dateMonthAdded);
    const monthAdded = getMonth(dateMonthAdded) + 1;

    // 다음달의 시작일
    const startDateAdded = this.findMonthlyBudgetStartDay(
      yearAdded,
      monthAdded,
    );
    return addDays(startDateAdded, -1);
  }
}
