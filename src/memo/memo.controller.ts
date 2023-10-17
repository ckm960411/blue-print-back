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
import { CreateMemoReqDto } from './dto/create-memo.req.dto';
import { UpdateMemoReqDto } from './dto/update-memo.req.dto';
import { MemoService } from './memo.service';

@Controller('memo')
export class MemoController {
  constructor(private readonly memoService: MemoService) {}

  @Get()
  getAllMemos(@Query('checked', new ParseBoolPipe()) checked: boolean) {
    return this.memoService.findAllMemos(checked);
  }

  @Post()
  createMemo(@Body() createMemoReqDto: CreateMemoReqDto) {
    return this.memoService.createMemo(createMemoReqDto);
  }

  @Patch(':id')
  updateMemo(
    @Param('id', new ParseIntPipe()) id: number,
    @Body() updateMemoReqDto: UpdateMemoReqDto,
  ) {
    return this.memoService.updateMemo(id, updateMemoReqDto);
  }

  @Delete(':id')
  deleteMemo(@Param('id', ParseIntPipe) id: number) {
    return this.memoService.deleteMemo(id);
  }
}
