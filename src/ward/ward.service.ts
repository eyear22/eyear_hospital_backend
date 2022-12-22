import { BadRequestException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteWardDto } from 'src/hospital/dto/request-dto/delete-ward.dto';
import { Repository } from 'typeorm';
import { Ward } from './entities/ward.entity';

@Injectable()
export class WardService {
  constructor(
    @InjectRepository(Ward)
    private wardRepository: Repository<Ward>,
  ) {
    this.wardRepository = wardRepository;
  }

  async deleteWard(requestDto: DeleteWardDto, hospitalId: string) {
    const ward = await this.wardRepository.findOne({
      where: { id: requestDto.id, hospital: { hospitalId: hospitalId } },
    });

    if (ward === null) {
      throw new BadRequestException({
        statusCode: HttpStatus.BAD_REQUEST,
        message: ['요청한 병동을 찾을 수 없습니다.'],
        error: 'BAD_REQUEST',
      });
    }

    await this.wardRepository.delete({ id: requestDto.id });
    return 'success';
  }
}
