import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class LoginHospitalDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: '병원 아이디', example: 'test_id' })
  hospitalId: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: '비밀번호', example: 'test_password' })
  password!: string;
}
