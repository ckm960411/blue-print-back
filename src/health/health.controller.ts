import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { OptionalIntPipe } from '../../utils/decorators/optional-int.pipe';
import { User } from '../../utils/decorators/user.decorator';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { UserEntity } from '../user/entity/user.entity';
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
}
