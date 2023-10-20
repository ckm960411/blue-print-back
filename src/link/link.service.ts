import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateLinkReqDto } from './dto/create-link.req.dto';

@Injectable()
export class LinkService {
  constructor(private prisma: PrismaService) {}

  async createOneLink(data: CreateLinkReqDto) {
    return this.prisma.link.create({ data });
  }

  async deleteLink(id: number) {
    return this.prisma.link.delete({ where: { id } });
  }
}
