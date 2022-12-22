import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class ChangeStateDto {
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({ description: '예약 아이디', example: 3 })
  reservationId: number;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({
    description: '승인 여부 (true: 1, false: -1)',
    example: 1,
  })
  state: number;
}
