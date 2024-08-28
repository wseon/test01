import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Review } from './entities/review.entity';
import { CreateReviewDto } from './dto/create-review.dto';
import { Work } from 'src/work/entities/work.entity';
import { Client } from 'src/auth/entities/client.entity';
import { Broker } from 'src/auth/entities/broker.entity';

@Injectable()
export class ReviewService {
  constructor(
    @InjectRepository(Review)
    private reviewRepository: Repository<Review>,
    @InjectRepository(Work)
    private workRepository: Repository<Work>,
    @InjectRepository(Client)
    private clientRepository: Repository<Client>,
    @InjectRepository(Broker)
    private brokerRepository: Repository<Broker>,
  ) {}

  // 리뷰 생성
  async createReview(createReviewDto: CreateReviewDto, clientId: number): Promise<Review> {
    const client = await this.clientRepository.findOne({ where: { id: clientId } });
    const work = await this.workRepository.findOne({ where: { id: createReviewDto.workId }, relations: ['contract'] });

    if (!client || !work) {
      throw new NotFoundException('Client or Work not found');
    }

    const broker = work.contract.broker;

    const review = this.reviewRepository.create({
      client,
      work,
      broker,
      content: createReviewDto.content,
      rating: createReviewDto.rating,
    });

    return this.reviewRepository.save(review);
  }

  // 리뷰 조회
  async getReviewsByWork(workId: number): Promise<Review[]> {
    return this.reviewRepository.find({ where: { work: { id: workId } }, relations: ['client', 'comments'] });
  }
}
