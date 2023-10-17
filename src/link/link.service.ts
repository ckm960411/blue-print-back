import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class LinkService {
  constructor(private prisma: PrismaService) {}

  async createLink(links: { name: string; href: string }[]) {
    return this.prisma.link.createMany({ data: links });
  }
}
