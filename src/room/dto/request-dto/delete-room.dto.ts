import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class DeleteRoomDto {
  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({ description: '병실 아이디', example: 1 })
  id: number;
}
