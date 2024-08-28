import { Controller, Post, Body, UseGuards, Req, Param, Get } from '@nestjs/common';
import { ReviewService } from './review.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth-guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Request as ExpressRequest } from 'express';

@ApiTags('Reviews')
@Controller('reviews')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @ApiOperation({ summary: 'Create a new review' })
  @ApiBearerAuth()
  @Post()
  @Roles('client')
  async createReview(@Req() req: ExpressRequest, @Body() createReviewDto: CreateReviewDto) {
    const clientId = req.user.id;
    return this.reviewService.createReview(createReviewDto, clientId);
  }

  @ApiOperation({ summary: 'Get all reviews for a work' })
  @ApiBearerAuth()
  @Get('work/:workId')
  @Roles('client')
  async getReviewsByWork(@Param('workId') workId: number) {
    return this.reviewService.getReviewsByWork(workId);
  }
}
