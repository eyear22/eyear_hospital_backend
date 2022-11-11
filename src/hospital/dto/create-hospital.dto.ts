import { IsNotEmpty, IsString, Matches } from 'class-validator';

export class CreateHospitalDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  hospitalId: string;

  // todo: 비밀번호 형식 프론트랑 의논해서 validation 추가하기
  @IsString()
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^\d{2,3}-\d{3,4}-\d{4}$/)
  phoneNumber: string;

  // todo: 주소 형식 프론트랑 의논해서 validation 추가하기
  @IsString()
  @IsNotEmpty()
  address: string;
}
