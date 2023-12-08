import { Injectable } from '@nestjs/common';
import { endOfMonth, getMonth, getYear, startOfMonth } from 'date-fns';
import { PrismaService } from '../prisma/prisma.service';
import { omit } from 'lodash';

@Injectable()
export class HealthService {
  constructor(private prisma: PrismaService) {}

  async getMonthExercises(
    userId: number,
    { year, month }: { year?: number; month?: number },
  ) {
    const yearToFind = year ?? getYear(new Date());
    const monthToFind = month ? month - 1 : getMonth(new Date());

    const userExercises = await this.prisma.userExercise.findMany({
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
        exercise: {
          include: {
            exerciseType: true,
          },
        },
      },
    });

    // userExercises 배열에서 exercise 객체만을 추출하여 새 배열을 생성
    // 이때, exercise 객체에 exerciseType의 name을 포함
    return userExercises.map((userExercise) => {
      const exerciseWithType = {
        ...userExercise.exercise,
        name: userExercise.exercise.exerciseType.name,
        unit: userExercise.exercise.exerciseType.unit,
      };
      return omit(exerciseWithType, 'exerciseType');
    });
  }
}
