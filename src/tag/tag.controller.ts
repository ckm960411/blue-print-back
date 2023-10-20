import { Body, Controller, Post } from '@nestjs/common';
import { CreateTagReqDto } from './dto/create-tag.req.dto';
import { TagService } from './tag.service';

@Controller('tag')
export class TagController {
  constructor(private readonly tagServce: TagService) {}

  @Post()
  createTag(@Body() createTagReqDto: CreateTagReqDto) {
    return this.tagServce.createTag(createTagReqDto);
  }
}
