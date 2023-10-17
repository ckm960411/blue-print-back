import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
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

  @Delete(':id')
  deleteMemo(@Param('id', ParseIntPipe) id: number) {
    return this.memoService.deleteMemo(id);
  }

  @Patch('bookmark/:id')
  bookmarkMemo(
    @Param('id', ParseIntPipe) id: number,
    @Body('bookmark') bookmark: boolean,
  ) {
    return this.memoService.bookmarkMemo(id, bookmark);
  }
}
