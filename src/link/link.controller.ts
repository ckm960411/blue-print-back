import {
  Body,
  Controller,
  Delete,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { CreateLinkReqDto } from './dto/create-link.req.dto';
import { LinkService } from './link.service';

@Controller('link')
export class LinkController {
  constructor(private readonly linkService: LinkService) {}

  @Post()
  createLink(@Body() createLinkReqDto: CreateLinkReqDto) {
    return this.linkService.createOneLink(createLinkReqDto);
  }

  @Delete(':id')
  deleteLink(@Param('id', new ParseIntPipe()) id: number) {
    return this.linkService.deleteLink(id);
  }
}
