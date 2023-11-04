import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCommentReqDto } from './dto/create-comment.req.dto';
import { UpdateCommentReqDto } from './dto/update-comment.req.dto';

@Injectable()
export class CommentService {
  constructor(private prisma: PrismaService) {}

  async findAllComments(milestoneId: number) {
    return this.prisma.comment.findMany({
      where: { milestoneId },
    });
  }

  async createComment(createCommentReqDto: CreateCommentReqDto) {
    return this.prisma.comment.create({ data: createCommentReqDto });
  }
  async updateComment(id: number, updateCommentReqDto: UpdateCommentReqDto) {
    return this.prisma.comment.update({
      where: { id },
      data: updateCommentReqDto,
    });
  }
}
