import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { load } from 'cheerio';
import { notionApi } from './notion-client';
import { studyBlocks } from './study/blocks';

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

  async getStudyBlocks() {
    return studyBlocks;
  }

  async getMetatags(url: string) {
    const { data: html } = await axios.get(url);
    const $ = load(html);

    // 파비콘 가져오기
    const faviconLink =
      $('link[rel="shortcut icon"]').attr('href') ||
      $('link[rel="icon"]').attr('href');

    // 메타태그 가져오기
    const metaTags: Record<string, string> = {};

    $('meta').each((index, el) => {
      const nameValue = $(el).attr('name');
      const contentValue = $(el).attr('content');
      const propertyValue = $(el).attr('property');

      if (nameValue && contentValue) {
        metaTags[nameValue] = contentValue;
      }

      if (propertyValue && contentValue) {
        metaTags[propertyValue] = contentValue;
      }
    });

    return { faviconLink, metaTags };
  }
}
