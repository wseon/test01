export class CreateReviewDto {
  workId: number;
  content: string;
  rating: number; // 1~5 사이의 평점
}
