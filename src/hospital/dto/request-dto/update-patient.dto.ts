import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class UpdatePatientDto {
  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({ description: '환자 아이디', example: 1 })
  id: number;

  @IsOptional()
  @IsString()
  @ApiProperty({ description: '환자 이름', example: '박노인' })
  name?: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: '환자 번호', example: 'PA1231' })
  patNumber?: string;

  @IsOptional()
  @IsNotEmpty()
  @IsDateString()
  @ApiProperty({ description: '환자 생년월일', example: '1999-10-10' })
  birth?: Date;

  @IsOptional()
  @IsNotEmpty()
  @IsDateString()
  @ApiProperty({ description: '환자 입원일자', example: '2013-03-10' })
  inDate?: Date;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: '환자 주민번호', example: '000000-0000000' })
  infoNumber?: string;
}
