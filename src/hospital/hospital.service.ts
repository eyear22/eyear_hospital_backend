import { ForbiddenException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateHospitalDto } from './dto/create-hospital.dto';
import { Hospital } from './entities/hospital.entity';
import { hash } from 'bcrypt';
import { IdCheckDto } from './dto/id-check.dto';
import { CreateWardDto } from './dto/create-ward.dto';
import { Ward } from './entities/ward.entity';

@Injectable()
export class HospitalService {
  constructor(
    @InjectRepository(Hospital)
    private hospitalRepository: Repository<Hospital>,
    @InjectRepository(Ward)
    private wardRepository: Repository<Ward>,
  ) {
    this.hospitalRepository = hospitalRepository;
    this.wardRepository = wardRepository;
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

  async createWard(
    requestDto: CreateWardDto,
    hospitalId: string,
  ): Promise<any> {
    const existedHospital = await this.findHospital(hospitalId);

    if (existedHospital) {
      const { id } = existedHospital;
      const wardName = requestDto.name;

      const isExist = await this.wardRepository
        .createQueryBuilder('ward')
        .select('ward.id')
        .where('ward.name = :wardName', { wardName })
        .andWhere('ward.hospitalId = :id', { id })
        .execute();

      if (isExist.length != 0) {
        throw new ForbiddenException({
          statusCode: HttpStatus.FORBIDDEN,
          message: ['Already registered ward'],
          error: 'Forbidden',
        });
      }
    }

    const { id, name } = await this.wardRepository.save({
      name: requestDto.name,
      hospital: existedHospital,
    });

    const result = {
      id: id,
      name: name,
    };
    return result;
  }

  async findHospital(hospitalId: string): Promise<Hospital> {
    const hospital = await this.hospitalRepository.findOneBy({
      hospitalId,
    });

    if (hospital) {
      return hospital;
    }

    throw new ForbiddenException({
      statusCode: HttpStatus.FORBIDDEN,
      message: ['Not Existed Hospital'],
      error: 'Forbidden',
    });
  }
}
