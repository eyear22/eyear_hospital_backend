import { IsBoolean, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateRoomDto {
  @IsNotEmpty()
  @IsNumber()
  roomNumber: number;

  @IsNotEmpty()
  @IsNumber()
  limitPatient: number;

  @IsNotEmpty()
  @IsBoolean()
  icuCheck: boolean;

  @IsNotEmpty()
  @IsString()
  wardName: string;
}
