import { Injectable } from '@nestjs/common';
import { notionApi } from './notion-client';

@Injectable()
export class NotionService {
  async getPageById(page_id: string) {
    return await notionApi.pages.retrieve({ page_id });
  }

  async getBlockChildrenById(block_id: string, page_size = 100) {
    return await notionApi.blocks.children.list({
      block_id,
      page_size,
    });
  }
}
