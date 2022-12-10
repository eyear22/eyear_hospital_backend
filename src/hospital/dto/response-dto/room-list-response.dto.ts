import { ApiProperty } from '@nestjs/swagger';
import { BaseResponse } from 'src/util/swagger/base-response.dto';

class RoomResponseData {
  @ApiProperty({ description: '병동 아이디', example: 1 })
  ward_id: number;

  @ApiProperty({ description: '병동 이름', example: '201동' })
  ward_name: string;

  @ApiProperty({ description: '병실 아이디', example: 2 })
  room_id: number;

  @ApiProperty({
    description: '병실 생성일',
    example: '2022-12-04T16:12:40.842Z',
  })
  room_createdAt: Date;

  @ApiProperty({ description: '병실 번호', example: 101 })
  room_number: number;

  @ApiProperty({ description: '병실 입원 환자 수 ', example: 10 })
  room_currentPatient: number;

  @ApiProperty({ description: 'icu 여부', example: true })
  room_icuCheck: boolean;
}

export abstract class RoomListResponse extends BaseResponse {
  constructor() {
    super();
  }

  @ApiProperty({
    description: 'response result',
    example: [
      {
        ward_id: 2,
        ward_name: '201동',
        room_id: 3,
        room_createdAt: '2022-12-04T16:10:57.293Z',
        room_number: 101,
        room_currentPatient: 1,
        room_icuCheck: 1,
      },
      {
        ward_id: 2,
        ward_name: '201동',
        room_id: 4,
        room_createdAt: '2022-12-04T16:12:40.842Z',
        room_number: 102,
        room_currentPatient: 1,
        room_icuCheck: 1,
      },
    ],
  })
  rooms: RoomResponseData[];
}
