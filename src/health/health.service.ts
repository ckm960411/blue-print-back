import { BadRequestException, Injectable } from '@nestjs/common';
import { map, omit } from 'lodash';
import { flow } from 'lodash/fp';
import {
  endOfDay,
  endOfWeek,
  getDay,
  getMonth,
  getYear,
  isDate,
  startOfDay,
  startOfWeek,
} from 'date-fns';
import { format, startOfMonth, endOfMonth } from 'date-fns/fp';

import { PrismaService } from '../prisma/prisma.service';
import { CreateExerciseTypeReqDto } from './dto/create-exercise-type.req.dto';
import { CreateExerciseReqDto } from './dto/create-exercise.req.dto';
import { CreateWeightReqDto } from './dto/create-weight.req.dto';

@Injectable()
export class HealthService {
  constructor(private prisma: PrismaService) {}

  /**
   * 기간 사이의 Exercises[] 를 반환
   * @param userId number
   * @param from 'yyyy-MM-dd'
   * @param to 'yyyy-MM-dd'
   */
  async getExercises(userId: number, from: string, to: string) {
    if (!isDate(new Date(from)) || !isDate(new Date(to))) {
      throw new BadRequestException('날짜 정보를 올바르게 입력해주세요');
    }

    const start = startOfDay(new Date(from));
    const end = endOfDay(new Date(to));

    const exercises = await this.prisma.exercise.findMany({
      where: {
        userId,
        date: {
          gte: start,
          lte: end,
        },
      },
      include: {
        exerciseType: true,
      },
    });

    return map(exercises, (exercise) => ({
      ...omit(exercise, 'exerciseType'), // exerciseType 은 제외
      ...omit(exercise.exerciseType, 'id'), // exerciseType.id 는 제외하고 전개
    }));
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

  /**
   * 한주간의 운동 여부를 boolean 객체로 반환
   * @param userId number
   * @param today 'yyyy-MM-dd'
   */
  async getWeeklyExerciseChecked(userId, today: string) {
    const dateToFind = new Date(today);
    if (!isDate(dateToFind)) {
      throw new BadRequestException('날짜 정보를 올바르게 입력해주세요');
    }

    const start = flow(
      (date: Date) => startOfWeek(date, { weekStartsOn: 1 }),
      format('yyyy-MM-dd'),
    )(dateToFind);
    const end = flow(
      (date: Date) => endOfWeek(date, { weekStartsOn: 1 }),
      format('yyyy-MM-dd'),
    )(dateToFind);

    const exercises = await this.getExercises(userId, start, end);

    const weeklyChecked = {
      0: false,
      1: false,
      2: false,
      3: false,
      4: false,
      5: false,
      6: false,
    };

    exercises.forEach((exercise) => {
      const exerciseDay = getDay(exercise.date);
      Object.keys(weeklyChecked).forEach((index) => {
        const dayIndex = Number(index);
        if (dayIndex === exerciseDay) weeklyChecked[dayIndex] = true;
      });
    });

    return weeklyChecked;
  }

  async createExercise(
    userId: number,
    createExerciseReqDto: CreateExerciseReqDto,
  ) {
    return this.prisma.exercise.create({
      data: {
        userId,
        ...createExerciseReqDto,
      },
    });
  }

  async getAllExerciseType() {
    return this.prisma.exerciseType.findMany();
  }

  async createExerciseType(createExerciseTypeReqDto: CreateExerciseTypeReqDto) {
    if (!createExerciseTypeReqDto.name || !createExerciseTypeReqDto.unit) {
      throw new BadRequestException('name 또는 unit 을 입력해주세요.');
    }

    return this.prisma.exerciseType.create({ data: createExerciseTypeReqDto });
  }

  async createWeight(userId: number, createWeightReqDto: CreateWeightReqDto) {
    return this.prisma.weight.create({
      data: {
        userId,
        ...createWeightReqDto,
      },
    });
  }
}
