import { BadRequestException, Injectable } from '@nestjs/common';
import { omit } from 'lodash';
import { flow } from 'lodash/fp';
import { getMonth, getYear, isDate } from 'date-fns';
import { format, startOfMonth, endOfMonth } from 'date-fns/fp';

import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class HealthService {
  constructor(private prisma: PrismaService) {}

  async getExercises(userId: number, from: string, to: string) {
    if (!isDate(new Date(from)) || !isDate(new Date(to))) {
      throw new BadRequestException('날짜 정보를 올바르게 입력해주세요');
    }

    const start = new Date(from);
    const end = new Date(to);

    const userExercises = await this.prisma.userExercise.findMany({
      where: {
        userId,
        exercise: { date: { gte: start, lte: end } },
      },
      include: { exercise: { include: { exerciseType: true } } },
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

  async getMonthExercises(
    userId: number,
    { year, month }: { year?: number; month?: number },
  ) {
    const yearToFind = year ?? getYear(new Date());
    const monthToFind = month ? month - 1 : getMonth(new Date());

    const dateToFind = new Date(yearToFind, monthToFind);

    const start = flow(startOfMonth, format('yyyy-MM-dd'))(dateToFind);
    const end = flow(endOfMonth, format('yyyy-MM-dd'))(dateToFind);

    return this.getExercises(userId, start, end);
  }
}
