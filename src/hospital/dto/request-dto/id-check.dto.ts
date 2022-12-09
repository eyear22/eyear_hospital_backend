import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class IdCheckDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: '병원 아이디', example: 'test_id' })
  hospitalId: string;
}
