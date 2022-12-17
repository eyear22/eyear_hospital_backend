import { ApiProperty } from '@nestjs/swagger';
import { BaseResponse } from '../../../util/swagger/base-response.dto';

class IdCheckResponseData {
  result: boolean;
  test: string;
}

export abstract class IdCheckResponse extends BaseResponse {
  constructor() {
    super();
  }

  @ApiProperty({
    description: 'response result',
    example: {
      result: true,
      text: '이미 존재하는 아이디입니다.',
    },
  })
  idCheck: IdCheckResponseData;
}
