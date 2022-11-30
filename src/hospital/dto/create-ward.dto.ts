import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateWardDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: '병동 이름', example: '201동' })
  name: string;
}
