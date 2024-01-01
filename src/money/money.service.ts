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
  isSameDay,
} from 'date-fns';
import { omit, orderBy } from 'lodash';
import {
  pipe,
  filter as filterFp,
  groupBy as groupByFp,
  orderBy as orderByFp,
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

  async upsertBalance(userId: number, balance: number) {
    return this.prisma.money.upsert({
      where: { userId },
      create: { userId, balance },
      update: { balance },
    });
  }

  async getBalance(userId: number) {
    return this.prisma.money.findFirst({ where: { userId } });
  }

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
      include: { MonthlyBudget: true, BudgetCategory: true, Expenditure: true },
    });

    return categories.map((category) => ({
      ...omit(category, ['MonthlyBudget', 'BudgetCategory', 'Expenditure']),
      year: category.MonthlyBudget.year,
      month: category.MonthlyBudget.month,
      start: category.MonthlyBudget.start,
      end: category.MonthlyBudget.end,
      categoryName: category.BudgetCategory.name,
      categoryUnicode: category.BudgetCategory.unicode,
      expenditures: orderBy(
        category.Expenditure,
        (e) => new Date(e.year, e.month - 1, e.date, e.hour, e.minute),
        ['desc'],
      ),
      spent: category.Expenditure.reduce((acc, cur) => {
        if (cur.type === 'INCOME') return acc;
        return acc + cur.price;
      }, 0),
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

  async getExpenditures(userId: number, data: { year: number; month: number }) {
    const startDate = this.findMonthlyBudgetStartDay(data.year, data.month);
    const start = format(startDate, 'yyyy-MM-dd');
    const endDate = this.findMonthlyBudgetEndDay(data.year, data.month);
    const end = format(endDate, 'yyyy-MM-dd');

    const thisMonthExpenditures = await this.prisma.expenditure.findMany({
      where: { userId, year: data.year, month: data.month },
    });
    const { year: yearAdded, month: monthAdded } = this.findNextYearAndMonth(
      data.year,
      data.month,
    );
    const nextMonthExpenditures = await this.prisma.expenditure.findMany({
      where: { userId, year: yearAdded, month: monthAdded },
    });

    return [...thisMonthExpenditures, ...nextMonthExpenditures].filter(
      (expenditure) => {
        const date = new Date(
          expenditure.year,
          expenditure.month - 1,
          expenditure.date,
        );
        return (
          isAfter(date, addDays(new Date(start), -1)) &&
          isBefore(date, addDays(new Date(end), +1))
        );
      },
    );
  }

  async getMonthlySpending(
    userId: number,
    data: { year: number; month: number },
  ) {
    const expenditures = await this.getExpenditures(userId, data);

    const monthlySpending = expenditures.reduce((acc, { type, price }) => {
      return acc + (type === 'SPENDING' ? price : 0);
    }, 0);

    const dailySpending = expenditures.reduce((acc, cur) => {
      const todayExpenditure = isSameDay(
        new Date(cur.year, cur.month - 1, cur.date),
        new Date(),
      );
      if (!todayExpenditure) return acc;
      if (cur.type === 'INCOME') return acc;
      return acc + cur.price;
    }, 0);

    return {
      monthly: monthlySpending,
      daily: dailySpending,
    };
  }

  async getMonthlyExpenditures(
    userId: number,
    data: { year?: number; month?: number; category?: string },
  ) {
    const expenditures = await this.prisma.expenditure.findMany({
      where: { userId, year: data.year, month: data.month },
      include: { MonthlyBudgetCategory: true, BudgetCategory: true },
      orderBy: [{ hour: 'asc' }, { minute: 'asc' }], // 시간은 오름차순 정렬
    });
    type Expenditure = (typeof expenditures)[number];

    return pipe(
      // category 가 있다면 필터링
      filterFp((expenditure: Expenditure) => {
        if (!data?.category) return true;
        return data.category === expenditure?.BudgetCategory?.name;
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
          return {
            ...omit(expenditure, ['BudgetCategory']),
            budgetCategoryId: expenditure?.BudgetCategory?.id,
            budgetCategoryName: expenditure?.BudgetCategory?.name,
            budgetCategoryUnicode: expenditure?.BudgetCategory?.unicode,
          };
        }),
      })),
      // 일자 내림차순 정렬
      orderByFp(
        (dailyExpenditure: { date: string }) => dailyExpenditure.date,
        ['desc'],
      ),
    )(expenditures);
  }

  async createExpenditure(userId: number, data: CreateExpenditureReqDto) {
    const monthlyBudget = await this.getMonthlyBudget(
      userId,
      format(new Date(), 'yyyy-MM-dd'),
    );

    const monthlyBudgetCategories =
      await this.getMonthlyBudgetCategoriesByMonthlyBudget(
        userId,
        monthlyBudget.id,
      );
    const monthlyBudgetCategory = monthlyBudgetCategories.find(
      (monthlyBudgetCategory) =>
        monthlyBudgetCategory.budgetCategoryId === data.budgetCategoryId,
    );

    return this.prisma.expenditure.create({
      data: {
        userId,
        ...data,
        hour: data.hour ?? 0,
        minute: data.minute ?? 0,
        monthlyBudgetCategoryId: monthlyBudgetCategory?.id,
      },
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
    // 한달을 더함
    const { year: yearAdded, month: monthAdded } = this.findNextYearAndMonth(
      year,
      month,
    );

    // 다음달의 시작일
    const startDateAdded = this.findMonthlyBudgetStartDay(
      yearAdded,
      monthAdded,
    );
    return addDays(startDateAdded, -1);
  }

  findNextYearAndMonth(year: number, month: number) {
    const dateToFind = new Date(year, month - 1);
    // 한달을 더함
    const dateMonthAdded = addMonths(dateToFind, 1);
    const yearAdded = getYear(dateMonthAdded);
    const monthAdded = getMonth(dateMonthAdded) + 1;

    return { year: yearAdded, month: monthAdded };
  }
}
