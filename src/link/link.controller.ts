import { Controller, Delete, Param, ParseIntPipe } from '@nestjs/common';
import { LinkService } from './link.service';

@Controller('link')
export class LinkController {
  constructor(private readonly linkService: LinkService) {}

  @Delete(':id')
  deleteLink(@Param('id', new ParseIntPipe()) id: number) {
    return this.linkService.deleteLink(id);
  }
}
