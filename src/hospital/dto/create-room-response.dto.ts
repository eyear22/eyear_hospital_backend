import { ApiProperty } from '@nestjs/swagger';
import { BaseResponse } from 'src/util/swagger/base-response.dto';

class CreateRoomResponseData {
  id: number;
  roomNumber: number;
}

export abstract class CreateRoomResponse extends BaseResponse {
  constructor() {
    super();
  }

  @ApiProperty({
    description: 'response result',
    example: {
      id: 1,
      roomNumber: 100,
    },
  })
  room: CreateRoomResponseData;
}
