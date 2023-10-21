import {
  Body,
  Controller,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { CreateTagReqDto } from './dto/create-tag.req.dto';
import { TagService } from './tag.service';

@Controller('tag')
export class TagController {
  constructor(private readonly tagServce: TagService) {}

  @Post()
  createTag(@Body() createTagReqDto: CreateTagReqDto) {
    return this.tagServce.createTag(createTagReqDto);
  }

  @Patch(':id')
  updateTag(
    @Param('id', new ParseIntPipe()) id: number,
    @Body() updateTagReqDto: Partial<CreateTagReqDto>,
  ) {
    return this.tagServce.updateTag(id, updateTagReqDto);
  }
}
