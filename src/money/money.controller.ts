import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { OptionalIntPipe } from '../../utils/decorators/optional-int.pipe';
import { User } from '../../utils/decorators/user.decorator';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { UserEntity } from '../user/entity/user.entity';
import { CreateBudgetCategoryReqDto } from './dto/create-budget-category.req.dto';
import { CreateExpenditureReqDto } from './dto/create-expenditure.req.dto';
import { CreateMonthlyBudgetCategoryReqDto } from './dto/create-monthly-budget-category.req.dto';
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

  @Patch('budget/category/:id')
  @UseGuards(JwtAuthGuard)
  async updateBudgetCategory(
    @User() user: UserEntity,
    @Param('id', new ParseIntPipe()) categoryId: number,
    @Body() data: Partial<CreateBudgetCategoryReqDto>,
  ) {
    return this.moneyService.updateBudgetCategory(user.id, categoryId, data);
  }

  @Delete('budget/category/:id')
  @UseGuards(JwtAuthGuard)
  async deleteBudgetCategory(
    @User() user: UserEntity,
    @Param('id', new ParseIntPipe()) categoryId: number,
  ) {
    return this.moneyService.deleteBudgetCategory(user.id, categoryId);
  }

  @Get('budget/category/monthly')
  @UseGuards(JwtAuthGuard)
  async getMonthlyBudgetCategoriesByMonthlyBudget(
    @User() user: UserEntity,
    @Query('monthlyBudgetId', new ParseIntPipe()) monthlyBudgetId: number,
  ) {
    return this.moneyService.getMonthlyBudgetCategoriesByMonthlyBudget(
      user.id,
      monthlyBudgetId,
    );
  }

  @Post('budget/category/monthly')
  @UseGuards(JwtAuthGuard)
  async createMonthlyBudgetCategory(
    @User() user: UserEntity,
    @Body() data: CreateMonthlyBudgetCategoryReqDto,
  ) {
    return this.moneyService.createMonthlyBudgetCategory(user.id, data);
  }

  @Get('expenditure/monthly')
  @UseGuards(JwtAuthGuard)
  async getTotalMonthlyExpenditure(
    @User() user: UserEntity,
    @Query('year', new OptionalIntPipe()) year?: number,
    @Query('month', new OptionalIntPipe()) month?: number,
  ) {
    return this.moneyService.getTotalMonthlyExpenditure(user.id, {
      year,
      month,
    });
  }

  @Get('expenditure/')
  @UseGuards(JwtAuthGuard)
  async getMonthlyExpenditures(
    @User() user: UserEntity,
    @Query('year', new OptionalIntPipe()) year?: number,
    @Query('month', new OptionalIntPipe()) month?: number,
    @Query('category') category?: string,
  ) {
    return this.moneyService.getMonthlyExpenditures(user.id, {
      year,
      month,
      category,
    });
  }

  @Post('expenditure')
  @UseGuards(JwtAuthGuard)
  async createExpenditure(
    @User() user: UserEntity,
    @Body() data: CreateExpenditureReqDto,
  ) {
    return this.moneyService.createExpenditure(user.id, data);
  }
}
