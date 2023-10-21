import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { UpdateMilestoneReqDto } from './dto/update-milestone.req.dto';
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

  @Patch(':id')
  updateMilestone(
    @Param('id', new ParseIntPipe()) id: number,
    @Body() updateMilestoneReqDto: UpdateMilestoneReqDto,
  ) {
    return this.milestoneService.updateMilestone(id, updateMilestoneReqDto);
  }
}
