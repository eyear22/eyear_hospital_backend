import { ApiProperty } from '@nestjs/swagger';
import { BaseResponse } from '../../../util/swagger/base-response.dto';

class WardResponseData {
  @ApiProperty({ description: '병동 아이디', example: 1 })
  ward_id: number;

  @ApiProperty({ description: '병동 이름', example: '201동' })
  ward_name: string;
}

export abstract class WardListResponse extends BaseResponse {
  constructor() {
    super();
  }

  @ApiProperty({
    description: 'response result',
    example: [
      {
        ward_id: 1,
        ward_name: '201동',
      },
      {
        ward_id: 2,
        ward_name: '202동',
      },
    ],
  })
  wards: WardResponseData[];
}
