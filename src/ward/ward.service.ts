import {
  BadRequestException,
  ForbiddenException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateWardDto } from 'src/ward/dto/request-dto/create-ward.dto';
import { DeleteWardDto } from 'src/ward/dto/request-dto/delete-ward.dto';
import { Hospital } from 'src/hospital/entities/hospital.entity';
import { Repository } from 'typeorm';
import { Ward } from './entities/ward.entity';
import { UpdateWardDto } from './dto/request-dto/update-ward.dto';

@Injectable()
export class WardService {
  constructor(
    @InjectRepository(Ward)
    private wardRepository: Repository<Ward>,
    @InjectRepository(Hospital)
    private hospitalRepository: Repository<Hospital>,
  ) {
    this.wardRepository = wardRepository;
    this.hospitalRepository = hospitalRepository;
  }

  async createWard(
    requestDto: CreateWardDto,
    hospitalId: string,
  ): Promise<any> {
    const isExist = await this.wardRepository.findOne({
      where: { name: requestDto.name, hospital: { hospitalId: hospitalId } },
    });

    if (isExist) {
      throw new ForbiddenException({
        statusCode: HttpStatus.FORBIDDEN,
        message: ['Already registered ward'],
        error: 'Forbidden',
      });
    }

    const hospital = await this.hospitalRepository.findOneBy({
      hospitalId: hospitalId,
    });

    const { id, name } = await this.wardRepository.save({
      name: requestDto.name,
      hospital: hospital,
    });

    const result = {
      id: id,
      name: name,
    };
    return result;
  }

  async updateWard(requestDto: UpdateWardDto, hospitalId: string) {
    const ward = await this.findWard(requestDto.id, hospitalId);

    if (ward) {
      await this.wardRepository.update(
        { id: requestDto.id },
        { name: requestDto.name },
      );
      return requestDto;
    }
  }

  async deleteWard(requestDto: DeleteWardDto, hospitalId: string) {
    const ward = await this.findWard(requestDto.id, hospitalId);

    if (ward) {
      await this.wardRepository.delete({ id: requestDto.id });
      return 'success';
    }
  }

  async findWard(id: number, hospitalId: string) {
    const ward = await this.wardRepository.findOne({
      where: { id: id, hospital: { hospitalId: hospitalId } },
    });

    if (ward === null) {
      throw new BadRequestException({
        statusCode: HttpStatus.BAD_REQUEST,
        message: ['요청한 병동을 찾을 수 없습니다.'],
        error: 'BAD_REQUEST',
      });
    }

    return ward;
  }

  async getWards(hospitalId: string) {
    const wards = await this.wardRepository.find({
      where: { hospital: { hospitalId: hospitalId } },
    });

    const result = [];
    for (const ward of wards) {
      result.push({ ward_id: ward.id, ward_name: ward.name });
    }

    return result;
  }
}
