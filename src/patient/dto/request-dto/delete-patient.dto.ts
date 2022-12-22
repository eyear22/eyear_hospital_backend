import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class DeletePatientDto {
  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({ description: '환자 아이디', example: 1 })
  id: number;
}
