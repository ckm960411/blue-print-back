import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { User } from '../../utils/decorators/user.decorator';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { UserEntity } from '../user/entity/user.entity';
import { CreateMonthlyBudgetReqDto } from './dto/create-monthly-budget.req.dto';
import { MoneyService } from './money.service';

@Controller('money')
export class MoneyController {
  constructor(private readonly moneyService: MoneyService) {}

  @Post('budget/monthly')
  @UseGuards(JwtAuthGuard)
  async createMonthlyBudget(
    @User() user: UserEntity,
    @Body() data: CreateMonthlyBudgetReqDto,
  ) {
    return this.moneyService.createMonthlyBudget(user.id, data);
  }
}
