import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class DeleteWardDto {
  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({ description: '병동 아이디', example: 1 })
  id: number;
}
