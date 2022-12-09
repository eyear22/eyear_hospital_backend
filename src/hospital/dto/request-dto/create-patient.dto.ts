import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsString,
  Matches,
} from 'class-validator';

export class CreatePatientDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: '환자 이름', example: '박노인' })
  name: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: '환자 번호', example: 'PA1231' })
  patNumber: string;

  @IsNotEmpty()
  @IsDateString()
  @ApiProperty({ description: '환자 생년월일', example: '1999-10-10' })
  birth: Date;

  @IsNotEmpty()
  @IsDateString()
  @ApiProperty({ description: '환자 입원일자', example: '2013-03-10' })
  inDate: Date;

  @IsNotEmpty()
  @IsString()
  @Matches('/^d{6}-d{7}$/')
  @ApiProperty({ description: '환자 주민번호', example: '000000-0000000' })
  infoNumber: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: '병동 이름', example: '201동' })
  wardName: string;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({ description: '병실 호수', example: 100 })
  roomNumber: number;
}
