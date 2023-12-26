import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { User } from '../../utils/decorators/user.decorator';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { UserEntity } from '../user/entity/user.entity';
import { CreateBudgetCategoryReqDto } from './dto/create-budget-category.req.dto';
import { CreateMonthlyBudgetReqDto } from './dto/create-monthly-budget.req.dto';
import { UpdateMonthlyBudgetReqDto } from './dto/update-monthly-budget.req.dto';
import { MoneyService } from './money.service';

@Controller('money')
export class MoneyController {
  constructor(private readonly moneyService: MoneyService) {}

  @Get('budget/monthly')
  @UseGuards(JwtAuthGuard)
  async getMonthlyBudget(
    @User() user: UserEntity,
    @Query('date') date: string, // yyyy-MM-dd
  ) {
    return this.moneyService.getMonthlyBudget(user.id, date);
  }

  @Post('budget/monthly')
  @UseGuards(JwtAuthGuard)
  async createMonthlyBudget(
    @User() user: UserEntity,
    @Body() data: CreateMonthlyBudgetReqDto,
  ) {
    return this.moneyService.createMonthlyBudget(user.id, data);
  }

  @Patch('budget/monthly/:id')
  @UseGuards(JwtAuthGuard)
  async updateMonthlyBudget(
    @User() user: UserEntity,
    @Param('id', new ParseIntPipe()) budgetId: number,
    @Body() updateMonthlyBudget: UpdateMonthlyBudgetReqDto,
  ) {
    return this.moneyService.updateMonthlyBudget(
      user.id,
      budgetId,
      updateMonthlyBudget,
    );
  }

  @Get('budget/category')
  @UseGuards(JwtAuthGuard)
  async getAllBudgetCategories(@User() user: UserEntity) {
    return this.moneyService.getBudgetCategories(user.id);
  }

  @Post('budget/category')
  @UseGuards(JwtAuthGuard)
  async createBudgetCategory(
    @User() user: UserEntity,
    @Body() createBudgetCategoryReqDto: CreateBudgetCategoryReqDto,
  ) {
    return this.moneyService.createBudgetCategory(
      user.id,
      createBudgetCategoryReqDto,
    );
  }
}
