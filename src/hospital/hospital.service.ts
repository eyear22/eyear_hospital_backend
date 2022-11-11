import { ForbiddenException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateHospitalDto } from './dto/create-hospital.dto';
import { Hospital } from './entities/hospital.entity';
import { hash } from 'bcrypt';
import { IdCheckDto } from './dto/id-check.dto';

@Injectable()
export class HospitalService {
  constructor(
    @InjectRepository(Hospital)
    private hospitalRepository: Repository<Hospital>,
  ) {
    this.hospitalRepository = hospitalRepository;
  }

  async create(requestDto: CreateHospitalDto): Promise<any> {
    const isExist = await this.hospitalRepository.findOneBy({
      hospitalId: requestDto.hospitalId,
    });

    if (isExist) {
      throw new ForbiddenException({
        statusCode: HttpStatus.FORBIDDEN,
        message: ['Already registered id'],
        error: 'Forbidden',
      });
    }

    requestDto.password = await hash(
      requestDto.password,
      parseInt(process.env.HASH_NUMBER),
    );

    const { password, ...result } = await this.hospitalRepository.save(
      requestDto,
    );
    return result;
  }

  async idCheck(requestDto: IdCheckDto) {
    const isExist = await this.hospitalRepository.findOneBy({
      hospitalId: requestDto.hospitalId,
    });

    if (isExist) {
      return {
        result: true,
        message: '이미 존재하는 아이디입니다.',
      };
    }

    return {
      result: false,
      message: '사용 가능한 아이디입니다.',
    };
  }
}
