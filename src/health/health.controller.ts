import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { OptionalIntPipe } from '../../utils/decorators/optional-int.pipe';
import { User } from '../../utils/decorators/user.decorator';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { UserEntity } from '../user/entity/user.entity';
import { CreateExerciseTypeReqDto } from './dto/create-exercise-type.req.dto';
import { HealthService } from './health.service';

@Controller('health')
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @Get('exercises')
  @UseGuards(JwtAuthGuard)
  async getMonthExercises(
    @User() user: UserEntity,
    @Query('year', new OptionalIntPipe()) year?: number,
    @Query('month', new OptionalIntPipe()) month?: number,
  ) {
    return this.healthService.getMonthExercises(user.id, { year, month });
  }

  @Get('exercises/date')
  @UseGuards(JwtAuthGuard)
  async getOneDateExercises(
    @User() user: UserEntity,
    @Query('date') date: string, // 'yyyy-MM-dd'
  ) {
    return this.healthService.getExercises(user.id, date, date);
  }

  @Get('week/checked')
  @UseGuards(JwtAuthGuard)
  async getWeeklyExerciseChecked(
    @User() user: UserEntity,
    @Query('today') today: string, // 'yyyy-MM-dd'
  ) {
    return this.healthService.getWeeklyExerciseChecked(user.id, today);
  }

  @Get('exercises/type')
  async getAllExerciseType() {
    return this.healthService.getAllExerciseType();
  }

  @Post('exercises/type')
  async createExerciseType(
    @Body() createExerciseTypeReqDto: CreateExerciseTypeReqDto,
  ) {
    return this.healthService.createExerciseType(createExerciseTypeReqDto);
  }
}
