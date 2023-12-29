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
  getDate,
} from 'date-fns';
import { omit } from 'lodash';
import {
  pipe,
  filter as filterFp,
  groupBy as groupByFp,
  map as mapFp,
} from 'lodash/fp';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBudgetCategoryReqDto } from './dto/create-budget-category.req.dto';
import { CreateExpenditureReqDto } from './dto/create-expenditure.req.dto';
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

  async getTotalMonthlyExpenditure(
    userId: number,
    data: { year: number; month: number },
  ) {
    const expenditures = await this.prisma.expenditure.findMany({
      where: { userId, year: data.year, month: data.month },
    });

    const income = expenditures.reduce((acc, cur) => {
      return acc + (cur.type === 'INCOME' ? cur.price : 0);
    }, 0);
    const spending = expenditures.reduce((acc, cur) => {
      return acc + (cur.type === 'SPENDING' ? cur.price : 0);
    }, 0);

    return { income, spending };
  }

  async getMonthlyExpenditures(
    userId: number,
    data: { year?: number; month?: number; category?: string },
  ) {
    const expenditures = await this.prisma.expenditure.findMany({
      where: { userId, year: data.year, month: data.month },
      include: { MonthlyBudgetCategory: true },
      orderBy: [{ hour: 'desc' }, { minute: 'desc' }],
    });
    type Expenditure = (typeof expenditures)[number];

    const categories = await this.getBudgetCategories(userId);

    return pipe(
      // category 가 있다면 필터링
      filterFp((expenditure: Expenditure) => {
        if (!data?.category) return true;
        const category = categories.find((category) => {
          return (
            category.id ===
              expenditure?.MonthlyBudgetCategory?.budgetCategoryId &&
            category.name === data.category
          );
        });
        return !!category;
      }),
      // 일자별로 그룹
      groupByFp((expenditure: Expenditure) => expenditure.date),
      // 그룹된 values 만 취득
      Object.values,
      // 그룹된 것들의 공통 date, income 합, spending 합 포함해 반환
      mapFp((expenditures: Expenditure[]) => ({
        date: format(
          new Date(
            expenditures[0].year,
            expenditures[0].month - 1,
            expenditures[0].date,
          ),
          'yyyy-MM-dd',
        ),
        income: expenditures.reduce((acc, cur) => {
          return acc + (cur.type === 'INCOME' ? cur.price : 0);
        }, 0),
        spending: expenditures.reduce((acc, cur) => {
          return acc + (cur.type === 'SPENDING' ? cur.price : 0);
        }, 0),
        data: expenditures.map((expenditure) => {
          const category = categories.find((category) => {
            return (
              category.id ===
              expenditure?.MonthlyBudgetCategory?.budgetCategoryId
            );
          });
          return {
            ...omit(expenditure, 'MonthlyBudgetCategory'),
            budgetCategoryId: category?.id,
            budgetCategoryName: category?.name,
            budgetCategoryUnicode: category?.unicode,
          };
        }),
      })),
    )(expenditures);
  }

  async createExpenditure(userId: number, data: CreateExpenditureReqDto) {
    return this.prisma.expenditure.create({
      data: { userId, ...data, hour: data.hour ?? 0, minute: data.minute ?? 0 },
      include: { MonthlyBudgetCategory: true },
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
