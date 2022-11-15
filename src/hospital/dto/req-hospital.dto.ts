import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class ReqHospitalDto {
  @IsNotEmpty()
  @IsNumber()
  id: number;

  @IsNotEmpty()
  @IsString()
  hospitalId: string;
}
