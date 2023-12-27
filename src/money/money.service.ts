import { Injectable } from '@nestjs/common';
import {
  format,
  addMonths,
  getMonth,
  getYear,
  isBefore,
  isWeekend,
  addDays,
  isAfter,
} from 'date-fns';
import { omit } from 'lodash';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBudgetCategoryReqDto } from './dto/create-budget-category.req.dto';
import { CreateMonthlyBudgetCategoryReqDto } from './dto/create-monthly-budget-category.req.dto';
import { CreateMonthlyBudgetReqDto } from './dto/create-monthly-budget.req.dto';
import { UpdateMonthlyBudgetReqDto } from './dto/update-monthly-budget.req.dto';

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
    const today = new Date();

    let startDate = this.findMonthlyBudgetStartDay(data.year, data.month);
    let start = format(startDate, 'yyyy-MM-dd');
    let endDate = this.findMonthlyBudgetEndDay(data.year, data.month);
    let end = format(endDate, 'yyyy-MM-dd');

    if (isAfter(today, startDate)) {
      return this.prisma.monthlyBudget.create({
        data: { userId, ...data, start, end, budget: data.budget ?? 0 },
      });
    }

    const lastMonth = addMonths(today, -1);
    const year = getYear(lastMonth);
    const month = getMonth(lastMonth) + 1;

    startDate = this.findMonthlyBudgetStartDay(year, month);
    start = format(startDate, 'yyyy-MM-dd');
    endDate = this.findMonthlyBudgetEndDay(year, month);
    end = format(endDate, 'yyyy-MM-dd');

    return this.prisma.monthlyBudget.create({
      data: { userId, ...data, start, end, budget: data.budget ?? 0 },
    });
  }

  async updateMonthlyBudget(
    userId: number,
    budgetId: number,
    data: UpdateMonthlyBudgetReqDto,
  ) {
    return this.prisma.monthlyBudget.update({
      where: { userId, id: budgetId },
      data,
    });
  }

  async getBudgetCategories(userId: number) {
    return this.prisma.budgetCategory.findMany({
      where: { userId },
    });
  }

  async createBudgetCategory(userId: number, data: CreateBudgetCategoryReqDto) {
    return this.prisma.budgetCategory.create({
      data: {
        userId,
        ...data,
      },
    });
  }

  async updateBudgetCategory(
    userId: number,
    categoryId: number,
    data: Partial<CreateBudgetCategoryReqDto>,
  ) {
    return this.prisma.budgetCategory.update({
      where: { userId, id: categoryId },
      data,
    });
  }

  async deleteBudgetCategory(userId: number, categoryId: number) {
    const monthlyBudgetCategories =
      await this.prisma.monthlyBudgetCategory.findMany({
        where: { budgetCategoryId: categoryId },
      });

    for (const monthlyBudgetCategory of monthlyBudgetCategories) {
      await this.prisma.monthlyBudgetCategory.delete({
        where: { id: monthlyBudgetCategory.id },
      });
    }

    return this.prisma.budgetCategory.delete({
      where: { userId, id: categoryId },
    });
  }

  async getMonthlyBudgetCategoriesByMonthlyBudget(
    userId: number,
    monthlyBudgetId: number,
  ) {
    const categories = await this.prisma.monthlyBudgetCategory.findMany({
      where: { userId, monthlyBudgetId },
      include: { MonthlyBudget: true, BudgetCategory: true },
    });

    return categories.map((category) => ({
      ...omit(category, ['MonthlyBudget', 'BudgetCategory']),
      year: category.MonthlyBudget.year,
      month: category.MonthlyBudget.month,
      start: category.MonthlyBudget.start,
      end: category.MonthlyBudget.end,
      categoryName: category.BudgetCategory.name,
      categoryUnicode: category.BudgetCategory.unicode,
    }));
  }

  async createMonthlyBudgetCategory(
    userId: number,
    data: CreateMonthlyBudgetCategoryReqDto,
  ) {
    return this.prisma.monthlyBudgetCategory.create({
      data: { userId, ...data },
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
