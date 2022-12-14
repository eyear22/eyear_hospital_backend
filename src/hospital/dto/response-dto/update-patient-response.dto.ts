import { ApiProperty } from '@nestjs/swagger';
import { BaseResponse } from 'src/util/swagger/base-response.dto';
import { UpdatePatientDto } from '../request-dto/update-patient.dto';

export abstract class UpdatePatientResponse extends BaseResponse {
  constructor() {
    super();
  }

  @ApiProperty({
    description: 'response result',
    example: {
      id: 1,
      name: '박노인',
    },
  })
  patient: UpdatePatientDto;
}
