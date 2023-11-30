import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { OptionalIntPipe } from '../../utils/decorators/optional-int.pipe';
import { WorkService } from './work.service';

@Controller('work')
export class WorkController {
  constructor(private readonly workService: WorkService) {}

  @Get(':projectId/count')
  async getWorkCount(
    @Param('projectId', new ParseIntPipe()) projectId: number,
  ) {
    return this.workService.getWorkCount(projectId);
  }

  @Get(':projectId/calendar')
  async getThisMonthWorks(
    @Param('projectId', new ParseIntPipe()) projectId: number,
    @Query('year', new OptionalIntPipe()) year?: number,
    @Query('month', new OptionalIntPipe()) month?: number,
  ) {
    return this.workService.getThisMonthWorks(projectId, year, month);
  }
}
