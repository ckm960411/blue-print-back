import { Controller, Get, Param } from '@nestjs/common';
import { NotionService } from './notion.service';

@Controller('notion')
export class NotionController {
  constructor(private readonly notionService: NotionService) {}

  @Get('pages/:id')
  async getPageById(@Param('id') page_id: string) {
    return this.notionService.getPageById(page_id);
  }
}
