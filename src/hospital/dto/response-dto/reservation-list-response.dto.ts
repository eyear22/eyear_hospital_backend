import { ApiProperty } from '@nestjs/swagger';
import { BaseResponse } from 'src/util/swagger/base-response.dto';

class ReservationResponseData {
  @ApiProperty({ description: '예약 아이디', example: 1 })
  reservation_id: number;

  @ApiProperty({
    description: '면회 접수 신청 날짜',
    example: '2022-12-06T16:37:15.792Z',
  })
  reservation_createdAt: Date;

  @ApiProperty({ description: '대면/비대면 여부', example: true })
  reservation_faceToface: boolean;

  @ApiProperty({ description: '승인 여부', example: 0 })
  reservation_approveCheck: number;

  @ApiProperty({
    description: '면회 예약일',
    example: '2022-12-06T16:37:15.792Z',
  })
  reservation_reservationDate: Date;

  @ApiProperty({
    description: '환자 아이디',
    example: 1,
  })
  reservation_patientId: number;
}

export abstract class ReservationListResponse extends BaseResponse {
  constructor() {
    super();
  }

  @ApiProperty({
    description: 'response result',
    example: [
      {
        reservation_id: 1,
        reservation_createdAt: '2022-12-06T16:37:15.792Z',
        reservation_reservationDate: '2022-10-10T00:00:00.000Z',
        reservation_faceToface: 0,
        reservation_approveCheck: 0,
        reservation_patientId: 3,
      },
      {
        reservation_id: 2,
        reservation_createdAt: '2022-12-06T16:37:15.792Z',
        reservation_reservationDate: '2022-10-10T00:00:00.000Z',
        reservation_faceToface: 0,
        reservation_approveCheck: 0,
        patientId: 3,
      },
    ],
  })
  reservations: ReservationResponseData[];
}
