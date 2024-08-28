import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from './entities/comment.entity';
import { Review } from './entities/review.entity';
import { CreateCommentDto } from './dto/create-comment.dto';
import { Broker } from 'src/auth/entities/broker.entity';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment)
    private commentRepository: Repository<Comment>,
    @InjectRepository(Review)
    private reviewRepository: Repository<Review>,
    @InjectRepository(Broker)
    private brokerRepository: Repository<Broker>,
  ) {}

  // 댓글 생성
  async createComment(createCommentDto: CreateCommentDto, brokerId: number): Promise<Comment> {
    const broker = await this.brokerRepository.findOne({ where: { id: brokerId } });
    const review = await this.reviewRepository.findOne({ where: { id: createCommentDto.reviewId }, relations: ['broker'] });

    if (!broker || !review) {
      throw new NotFoundException('Broker or Review not found');
    }

    if (review.broker.id !== broker.id) {
      throw new UnauthorizedException('You can only comment on your own reviews');
    }

    const comment = this.commentRepository.create({
      broker,
      review,
      content: createCommentDto.content,
    });

    return this.commentRepository.save(comment);
  }

  // 특정 리뷰의 댓글 조회
  async getCommentsByReview(reviewId: number): Promise<Comment[]> {
    return this.commentRepository.find({ where: { review: { id: reviewId } }, relations: ['broker'] });
  }
}
