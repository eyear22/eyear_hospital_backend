import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateRoomDto {
  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({ description: '병실 호수', example: 100 })
  roomNumber: number;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({ description: '병실 최대 환자 수', example: 10 })
  limitPatient: number;

  @IsNotEmpty()
  @IsBoolean()
  @ApiProperty({ description: 'icu 병실 여부', example: true })
  icuCheck: boolean;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: '병동 이름', example: '201호' })
  wardName: string;
}
