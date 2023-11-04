import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCommentReqDto } from './dto/create-comment.req.dto';

@Injectable()
export class CommentService {
  constructor(private prisma: PrismaService) {}

  async createComment(createCommentReqDto: CreateCommentReqDto) {
    return this.prisma.comment.create({ data: createCommentReqDto });
  }
}
