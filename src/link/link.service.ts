import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateLinkReqDto } from './dto/create-link.req.dto';

@Injectable()
export class LinkService {
  constructor(private prisma: PrismaService) {}

  async createLink(links: CreateLinkReqDto[]) {
    return this.prisma.link.createMany({ data: links });
  }
}
