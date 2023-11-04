import { Body, Controller, Post } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CreateCommentReqDto } from './dto/create-comment.req.dto';

@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post()
  async createComment(@Body() createCommentReqDto: CreateCommentReqDto) {
    return this.commentService.createComment(createCommentReqDto);
  }
}
