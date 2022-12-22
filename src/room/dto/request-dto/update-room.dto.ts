import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class UpdateRoomDto {
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({ description: '수정을 원하는 병실 아이디', example: 3 })
  id: number;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: '병실이 포함된 병동 이름', example: '201동' })
  wardName: string;

  @IsOptional()
  @IsNumber()
  @ApiProperty({
    description: '병실 번호',
    example: 201,
  })
  roomNumber?: number;

  @IsOptional()
  @IsNumber()
  @ApiProperty({ description: '최대 환자 수 ', example: 10 })
  limitPatient?: number;

  @IsOptional()
  @IsBoolean()
  @ApiProperty({
    description: 'icu check',
    example: 0,
  })
  icuCheck?: boolean;
}
