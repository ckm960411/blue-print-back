import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateLinkReqDto } from './dto/create-link.req.dto';

@Injectable()
export class LinkService {
  constructor(private prisma: PrismaService) {}

  async createOneLink(data: CreateLinkReqDto) {
    return this.prisma.link.create({ data });
  }

  async createLink(links: CreateLinkReqDto[]) {
    const promises = links.map((link) =>
      this.prisma.link.create({ data: link }),
    );
    return await Promise.all(promises);
  }

  async deleteLink(id: number) {
    return this.prisma.link.delete({ where: { id } });
  }
}
