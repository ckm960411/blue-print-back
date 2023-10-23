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
} from '@nestjs/common';
import { ProgressStatus } from '@prisma/client';
import { UpdateMilestoneReqDto } from './dto/update-milestone.req.dto';
import { MilestoneService } from './milestone.service';

@Controller('milestone')
export class MilestoneController {
  constructor(private readonly milestoneService: MilestoneService) {}

  @Get()
  getAllMilestones(@Query('progress') progress: ProgressStatus) {
    return this.milestoneService.findAllMilestones(progress);
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

  @Delete(':id')
  deleteMilestone(@Param('id', new ParseIntPipe()) id: number) {
    return this.milestoneService.deleteMilestone(id);
  }
}
