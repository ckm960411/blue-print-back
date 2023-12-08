import { Injectable } from '@nestjs/common';
import { endOfMonth, getMonth, getYear, startOfMonth } from 'date-fns';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class HealthService {
  constructor(private prisma: PrismaService) {}

  async getMonthExercises(
    userId: number,
    { year, month }: { year?: number; month?: number },
  ) {
    const yearToFind = year ?? getYear(new Date());
    const monthToFind = month ? month - 1 : getMonth(new Date());

    return this.prisma.userExercise.findMany({
      where: {
        userId,
        exercise: {
          date: {
            gte: startOfMonth(new Date(yearToFind, monthToFind)),
            lte: endOfMonth(new Date(yearToFind, monthToFind)),
          },
        },
      },
      include: {
        exercise: true,
      },
    });
  }
}
