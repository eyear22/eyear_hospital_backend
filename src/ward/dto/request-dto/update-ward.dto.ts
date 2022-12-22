import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class UpdateWardDto {
  @ApiProperty({
    description: '수정을 원하는 병동 아이디',
    example: 1,
  })
  @IsNotEmpty()
  @IsNumber()
  id: number;

  @ApiProperty({
    description: '수정을 원하는 병동 이름',
    example: '201동',
  })
  @IsNotEmpty()
  @IsString()
  name: string;
}
