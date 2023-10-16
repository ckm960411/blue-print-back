import { Body, Controller, Get, Post } from '@nestjs/common';
import { CreateMemoReqDto } from './dto/create-memo.req.dto';
import { MemoService } from './memo.service';

@Controller('memo')
export class MemoController {
  constructor(private readonly memoService: MemoService) {}

  @Get()
  getAllMemos() {
    return this.memoService.findAllMemos();
  }

  @Post()
  createMemo(@Body() createMemoReqDto: CreateMemoReqDto) {
    return this.memoService.createMemo(createMemoReqDto);
  }
}
