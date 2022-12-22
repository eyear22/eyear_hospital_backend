import { ApiProperty } from '@nestjs/swagger';
import { BaseResponse } from '../../../util/swagger/base-response.dto';
import { UpdateRoomDto } from '../request-dto/update-room.dto';

export abstract class UpdateRoomResponse extends BaseResponse {
  constructor() {
    super();
  }

  @ApiProperty({
    description: 'response result - 병실의 수정된 데이터가 전송됩니다.',
  })
  room: UpdateRoomDto;
}
