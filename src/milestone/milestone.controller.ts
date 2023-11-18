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
import { OptionalIntPipe } from '../../utils/decorators/optional-int.pipe';
import { UpdateMilestoneReqDto } from './dto/update-milestone.req.dto';
import { MilestoneService } from './milestone.service';

@Controller('milestone')
export class MilestoneController {
  constructor(private readonly milestoneService: MilestoneService) {}

  @Get()
  getAllMilestones(
    @Query('progresses') progresses: ProgressStatus[],
    @Query('projectId', new OptionalIntPipe()) projectId?: number,
  ) {
    return this.milestoneService.findAllMilestones(progresses, projectId);
  }

  @Get(':id')
  getMilestoneById(@Param('id', new ParseIntPipe()) milestoneId: number) {
    return this.milestoneService.findMilestoneById(milestoneId);
  }

  @Post()
  createMilestone(@Body() { projectId }: { projectId?: number }) {
    return this.milestoneService.createMilestone(projectId);
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
