import { IsNotEmpty, IsString } from 'class-validator';

export class IdCheckDto {
  @IsString()
  @IsNotEmpty()
  hospitalId: string;
}
