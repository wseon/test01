import { Controller, Post, Body, UseGuards, Req, Param, Get } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth-guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Request as ExpressRequest } from 'express';


@ApiTags('Comments')
@Controller('comments')
@UseGuards(JwtAuthGuard, RolesGuard)
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @ApiOperation({ summary: 'Create a new comment on a review' })
  @ApiBearerAuth()
  @Post()
  @Roles('broker')
  async createComment(@Req() req: ExpressRequest, @Body() createCommentDto: CreateCommentDto) {
    const brokerId = req.user.id;
    return this.commentService.createComment(createCommentDto, brokerId);
  }

  @ApiOperation({ summary: 'Get all comments for a review' })
  @ApiBearerAuth()
  @Get('review/:reviewId')
  @Roles('broker')
  async getCommentsByReview(@Param('reviewId') reviewId: number) {
    return this.commentService.getCommentsByReview(reviewId);
  }
}
