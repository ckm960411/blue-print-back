import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseBoolPipe,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { OptionalIntPipe } from '../../utils/decorators/optional-int.pipe';
import { CreateMemoReqDto } from './dto/create-memo.req.dto';
import { UpdateMemoReqDto } from './dto/update-memo.req.dto';
import { MemoService } from './memo.service';

@Controller('memo')
export class MemoController {
  constructor(private readonly memoService: MemoService) {}

  @Get()
  async getAllMemos(
    @Query('checked', new ParseBoolPipe()) checked: boolean,
    @Query('projectId', new OptionalIntPipe()) projectId?: number,
    @Query('milestoneId', new OptionalIntPipe()) milestoneId?: number,
  ) {
    return this.memoService.findAllMemos(checked, projectId, milestoneId);
  }

  @Get(':id')
  async getOneMemoById(@Param('id', new ParseIntPipe()) id: number) {
    return this.memoService.findOneMemo(id);
  }

  @Post()
  async createMemo(@Body() createMemoReqDto: CreateMemoReqDto) {
    return this.memoService.createMemo(createMemoReqDto);
  }

  @Patch(':id')
  async updateMemo(
    @Param('id', new ParseIntPipe()) id: number,
    @Body() updateMemoReqDto: UpdateMemoReqDto,
  ) {
    return this.memoService.updateMemo(id, updateMemoReqDto);
  }

  @Delete(':id')
  async deleteMemo(@Param('id', ParseIntPipe) id: number) {
    return this.memoService.deleteMemo(id);
  }
}
