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
  name: string;

  @IsNotEmpty()
  @IsString()
  patNumber: string;

  @IsNotEmpty()
  @IsDateString()
  birth: Date;

  @IsNotEmpty()
  @IsDateString()
  inDate: Date;

  @IsNotEmpty()
  @IsString()
  @Matches('/^d{6}-d{7}$/')
  infoNumber: string;

  @IsNotEmpty()
  @IsString()
  wardName: string;

  @IsNotEmpty()
  @IsNumber()
  roomNumber: number;
}
