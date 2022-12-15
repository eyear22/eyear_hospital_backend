import { ApiProperty } from '@nestjs/swagger';
import { BaseResponse } from 'src/util/swagger/base-response.dto';

class PostDetailData {
  @ApiProperty({ description: '우편 아이디', example: 1 })
  id: number;

  @ApiProperty({ description: '영상 url', example: 'http://~~~' })
  video: string;

  @ApiProperty({ description: '자막 url', example: 'http://~~~' })
  text: string;

  @ApiProperty({ description: '확인 여부', example: true })
  check: boolean;

  @ApiProperty({ description: '우편 인덱스', example: 1 })
  stampNumber: number;

  @ApiProperty({ description: '카드 인덱스', example: 1 })
  cardNumber: number;

  @ApiProperty({ description: '우편 전송 날짜', example: '2022-12-12' })
  createdAt: string;
}

export abstract class PostDetailResponse extends BaseResponse {
  constructor() {
    super();
  }

  @ApiProperty({
    description: 'response result',
    example: {
      id: 1,
      video: 'test_url',
      text: 'test_url',
      check: false,
      stampNumber: 1,
      cardNumber: 1,
      createdAt: '2022-11-26',
    },
  })
  post: PostDetailData;
}
