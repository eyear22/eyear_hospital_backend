import { IsNotEmpty, IsString } from 'class-validator';

export class LoginHospitalDto {
  @IsString()
  @IsNotEmpty()
  hospitalId: string;

  @IsString()
  @IsNotEmpty()
  password!: string;
}
