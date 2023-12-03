import { Controller, Get, Param, Query } from '@nestjs/common';
import { OptionalIntPipe } from '../../utils/decorators/optional-int.pipe';
import { NotionService } from './notion.service';

@Controller('notion')
export class NotionController {
  constructor(private readonly notionService: NotionService) {}

  @Get('pages')
  async getPagesData(@Query('ids') ids: string[]) {
    return this.notionService.getPages(ids);
  }

  @Get('pages/:id')
  async getPageById(@Param('id') page_id: string) {
    return this.notionService.getPageById(page_id);
  }

  @Get('blocks/:id/children')
  async getBlockChildrenById(
    @Param('id') block_id: string,
    @Query('start_cursor') start_cursor?: string,
    @Query('page_size', new OptionalIntPipe()) page_size?: number,
  ) {
    return this.notionService.getBlockChildrenById(
      block_id,
      start_cursor,
      page_size,
    );
  }

  @Get('study')
  async getStudyBlocks() {
    return this.notionService.getStudyBlocks();
  }

  @Get('meta')
  async getMetatags(@Query('url') url: string) {
    return this.notionService.getMetatags(url);
  }
}
