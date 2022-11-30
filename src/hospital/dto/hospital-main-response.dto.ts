import { ApiProperty } from '@nestjs/swagger';
import { BaseResponse } from 'src/util/swagger/base-response.dto';

class HospitalMainResponseData {
  'post_id': number;
  'post_check': boolean;
  'patient_id': number;
  'patient_name': string;
  'patient_number': string;
  'patient_ward': string;
  'patient_roomNumber': number;
}

export abstract class HospitalMainResponse extends BaseResponse {
  constructor() {
    super();
  }

  @ApiProperty({
    description: 'response result',
    example: [
      {
        post_id: 5,
        patient_id: 1,
        post_check: 0,
        patient_name: '박노인',
        patient_number: 'P123',
        patient_ward: 'ward_test_name',
        patient_roomNumber: 100,
      },
      {
        post_id: 6,
        patient_id: 1234,
        post_check: 1,
        patient_name: '박노인',
        patient_number: 'P123',
        patient_ward: 'ward_test_name',
        patient_roomNumber: 100,
      },
    ],
  })
  today_posts: HospitalMainResponseData[];
}
