import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
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
}
