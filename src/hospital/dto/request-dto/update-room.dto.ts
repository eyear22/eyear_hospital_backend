import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsNumber } from 'class-validator';

export class UpdateRoomDto {
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({ description: '수정을 원하는 병실 아이디', example: 3 })
  id: number;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({
    description: '병실 번호',
    example: 201,
  })
  roomNumber: number;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({ description: '최대 환자 수 ', example: 10 })
  limitPatient: number;

  @IsNotEmpty()
  @IsBoolean()
  @ApiProperty({
    description: 'icu check',
    example: 0,
  })
  icuCheck: boolean;
}
