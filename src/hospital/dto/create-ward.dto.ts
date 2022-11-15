import { IsNotEmpty, IsString } from 'class-validator';

export class CreateWardDto {
  @IsNotEmpty()
  @IsString()
  name: string;
}
