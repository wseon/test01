import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Review } from './entities/review.entity';
import { Comment } from './entities/comment.entity';
import { ReviewService } from './review.service';
import { CommentService } from './comment.service';
import { ReviewController } from './review.controller';
import { CommentController } from './comment.controller';
import { Work } from 'src/work/entities/work.entity';
import { Client } from 'src/auth/entities/client.entity';
import { Broker } from 'src/auth/entities/broker.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Review, Comment, Work, Client, Broker]),
  ],
  providers: [ReviewService, CommentService],
  controllers: [ReviewController, CommentController],
})
export class ReviewModule {}
