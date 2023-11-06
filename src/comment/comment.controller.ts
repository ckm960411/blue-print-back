import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseBoolPipe,
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
    @Query('isChecked', new ParseBoolPipe()) isChecked?: boolean,
  ) {
    return this.commentService.findAllComments(milestoneId, isChecked);
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

  @Delete(':id')
  async deleteComment(@Param('id', new ParseIntPipe()) id: number) {
    return this.commentService.deleteComment(id);
  }
}
