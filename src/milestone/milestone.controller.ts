import { Controller } from '@nestjs/common';
import { MilestoneService } from './milestone.service';

@Controller('milestone')
export class MilestoneController {
  constructor(private readonly milestoneService: MilestoneService) {}
}
