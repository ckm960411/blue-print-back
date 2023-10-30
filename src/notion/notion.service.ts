import { Injectable } from '@nestjs/common';
import { notionApi } from './notion-client';

@Injectable()
export class NotionService {
  async getPageById(page_id: string) {
    return await notionApi.pages.retrieve({ page_id });
  }
}
