import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Matches } from 'class-validator';

export class CreateHospitalDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: '병원 이름', example: 'test_name' })
  name: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: '병원 아이디', example: 'test_id' })
  hospitalId: string;

  // todo: 비밀번호 형식 프론트랑 의논해서 validation 추가하기
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: '병원 비밀번호', example: 'test_password' })
  password: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^\d{2,3}-\d{3,4}-\d{4}$/)
  @ApiProperty({ description: '병원 전화번호', example: '010-1111-1111' })
  phoneNumber: string;

  // todo: 주소 형식 프론트랑 의논해서 validation 추가하기
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: '병원 주소', example: '서울시 중랑구' })
  address: string;
}
