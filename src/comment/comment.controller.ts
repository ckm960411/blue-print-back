import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { CommentService } from './comment.service';
import { CreateCommentReqDto } from './dto/create-comment.req.dto';
import { UpdateCommentReqDto } from './dto/update-comment.req.dto';

@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Get()
  async getAllComments(
    @Query('milestoneId', new ParseIntPipe()) milestoneId: number,
  ) {
    return this.commentService.findAllComments(milestoneId);
  }

  @Post()
  async createComment(@Body() createCommentReqDto: CreateCommentReqDto) {
    return this.commentService.createComment(createCommentReqDto);
  }

  @Patch(':id')
  async updateComment(
    @Param('id', new ParseIntPipe()) id: number,
    @Body() updateCommentReqDto: UpdateCommentReqDto,
  ) {
    return this.commentService.updateComment(id, updateCommentReqDto);
  }
}
