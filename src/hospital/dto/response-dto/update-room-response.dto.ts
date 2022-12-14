import { ApiProperty } from '@nestjs/swagger';
import { BaseResponse } from 'src/util/swagger/base-response.dto';

class UpdateRoomResponseData {
  @ApiProperty({ description: '병실 아이디', example: 1 })
  id: number;

  @ApiProperty({ description: '변경된 병실 번호', example: 201 })
  roomNumber: number;

  @ApiProperty({ description: '변경된 icu 병실 여부', example: 1 })
  icuCheck: boolean;

  @ApiProperty({
    description: '변경된 병실 최대 입원 가능 환자 수',
    example: 10,
  })
  limitPatient: number;
}

export abstract class UpdateRoomResponse extends BaseResponse {
  constructor() {
    super();
  }

  @ApiProperty({
    description: 'response result',
    example: {
      id: 1,
      roomNumber: 401,
      limitPatient: 10,
      icuCheck: true,
    },
  })
  room: UpdateRoomResponseData;
}
