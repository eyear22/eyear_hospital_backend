import { ApiProperty } from '@nestjs/swagger';
import { BaseResponse } from 'src/util/swagger/base-response.dto';

class UpdateWardResponseData {
  @ApiProperty({ description: '병동 아이디', example: 1 })
  id: number;

  @ApiProperty({ description: '수정된 병동 이름', example: '201동' })
  name: string;
}

export abstract class UpdateWardResponse extends BaseResponse {
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
  ward: UpdateWardResponseData;
}
