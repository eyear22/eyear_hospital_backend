import { ApiProperty } from '@nestjs/swagger';
import { BaseResponse } from 'src/util/swagger/base-response.dto';

class PatientListData {
  @ApiProperty({ description: '환자 아이디' })
  patient_id: number;

  @ApiProperty({ description: '환자 이름' })
  patient_name: string;

  @ApiProperty({ description: '환자 번호' })
  patient_patNumber: string;

  @ApiProperty({ description: '환자 입원일자' })
  patient_inDate: Date;

  @ApiProperty({ description: '병동 이름' })
  ward_name: string;

  @ApiProperty({ description: '병실 호수' })
  room_roomNumber: number;
}

export abstract class PatientListResponse extends BaseResponse {
  constructor() {
    super();
  }

  @ApiProperty({
    description: 'response result',
    example: [
      {
        patient_id: 3,
        patient_name: '두환자',
        patient_patNumber: 'BA1234',
        patient_inDate: '2019-10-12T15:00:00.000Z',
        ward_name: '201동',
        room_roomNumber: 101,
      },
      {
        patient_id: 4,
        patient_name: '이환자',
        patient_patNumber: 'BA5678',
        patient_inDate: '2019-10-12T15:00:00.000Z',
        ward_name: '201동',
        room_roomNumber: 102,
      },
    ],
  })
  patient: PatientListData[];
}
