import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNotEmpty } from 'class-validator';

export class ReservationQueryDto {
  @ApiProperty({
    description: '조회를 원하는 예약 날짜',
    example: '2022-12-12',
  })
  @IsNotEmpty()
  @IsDateString()
  reservationDate: Date;
}
