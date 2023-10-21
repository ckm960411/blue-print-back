import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTagReqDto } from './dto/create-tag.req.dto';

@Injectable()
export class TagService {
  constructor(private prisma: PrismaService) {}

  async createTag(data: CreateTagReqDto) {
    return this.prisma.tag.create({ data });
  }

  async updateTag(id: number, data: Partial<CreateTagReqDto>) {
    return this.prisma.tag.update({
      where: { id },
      data,
    });
  }
}
