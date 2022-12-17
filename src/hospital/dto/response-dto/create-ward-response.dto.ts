import { ApiProperty } from '@nestjs/swagger';
import { BaseResponse } from '../../../util/swagger/base-response.dto';

class CreateWardResponseData {
  id: number;
  name: string;
}

export abstract class CreateWardResponse extends BaseResponse {
  constructor() {
    super();
  }

  @ApiProperty({
    description: 'response result',
    example: {
      id: 1,
      name: '201동',
    },
  })
  ward: CreateWardResponseData;
}
