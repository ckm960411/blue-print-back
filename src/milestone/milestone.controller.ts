import { Controller, Get, Post } from '@nestjs/common';
import { MilestoneService } from './milestone.service';

@Controller('milestone')
export class MilestoneController {
  constructor(private readonly milestoneService: MilestoneService) {}

  @Get()
  getAllMilestones() {
    return this.milestoneService.findAllMilestones();
  }

  @Post()
  createMilestone() {
    return this.milestoneService.createMilestone();
  }
}
