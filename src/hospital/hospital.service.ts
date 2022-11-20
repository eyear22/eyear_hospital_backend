import { ForbiddenException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateHospitalDto } from './dto/create-hospital.dto';
import { Hospital } from './entities/hospital.entity';
import { hash } from 'bcrypt';
import { IdCheckDto } from './dto/id-check.dto';
import { CreateWardDto } from './dto/create-ward.dto';
import { Ward } from './entities/ward.entity';
import { CreateRoomDto } from './dto/create-room.dto';
import { Room } from './entities/room.entity';
import { Patient } from './entities/patient.entity';
import { CreatePatientDto } from './dto/create-patient.dto';

@Injectable()
export class HospitalService {
  constructor(
    @InjectRepository(Hospital)
    private hospitalRepository: Repository<Hospital>,
    @InjectRepository(Ward)
    private wardRepository: Repository<Ward>,
    @InjectRepository(Room)
    private roomRepository: Repository<Room>,
    @InjectRepository(Patient)
    private patientRepository: Repository<Patient>,
  ) {
    this.hospitalRepository = hospitalRepository;
    this.wardRepository = wardRepository;
    this.roomRepository = roomRepository;
    this.patientRepository = patientRepository;
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

      const isExist = await this.findWard(id, wardName);

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

  async createRoom(
    requestDto: CreateRoomDto,
    hospitalId: string,
  ): Promise<any> {
    const hospital = await this.findHospital(hospitalId);
    const ward = await this.findWard(hospital.id, requestDto.wardName);

    if (ward.length < 1) {
      throw new ForbiddenException({
        statusCode: HttpStatus.FORBIDDEN,
        message: ['Not Existed Ward'],
        error: 'Forbidden',
      });
    }

    const requestRoomNumber = requestDto.roomNumber;
    const wardId = ward[0].id;
    const isExist = await this.findRoom(wardId, requestRoomNumber);

    if (isExist.length != 0) {
      throw new ForbiddenException({
        statusCode: HttpStatus.FORBIDDEN,
        message: ['Already registered patient'],
        error: 'Forbidden',
      });
    }

    const { id, roomNumber } = await this.roomRepository.save({
      ward: ward[0],
      currentPatient: 0,
      ...requestDto,
    });

    const result = {
      id: id,
      roomNumber: roomNumber,
    };
    return result;
  }

  async findWard(id: number, wardName: string): Promise<Ward[]> {
    const ward = await this.wardRepository
      .createQueryBuilder('ward')
      .select()
      .where('ward.name = :wardName', { wardName })
      .andWhere('ward.hospitalId = :id', { id })
      .getMany();

    if (ward.length > 1) {
      throw new ForbiddenException({
        statusCode: HttpStatus.FORBIDDEN,
        message: ['병원 및 병동 정보가 올바르지 않습니다.'],
        error: 'Forbidden',
      });
    }

    return ward;
  }

  async findRoom(wardId: number, roomNumber: number): Promise<Room[]> {
    const room = await this.roomRepository
      .createQueryBuilder('room')
      .select()
      .where('room.roomNumber = :roomNumber', { roomNumber })
      .andWhere('room.wardId = :wardId', { wardId })
      .getMany();

    if (room.length > 1) {
      throw new ForbiddenException({
        statusCode: HttpStatus.FORBIDDEN,
        message: ['병동 및 병실 정보가 올바르지 않습니다.'],
        error: 'Forbidden',
      });
    }

    return room;
  }

  async createPatient(requestDto: CreatePatientDto, hospitalId: string) {
    const hospital = await this.findHospital(hospitalId);
    const ward = await this.findWard(hospital.id, requestDto.wardName);
    const room = await this.findRoom(ward[0].id, requestDto.roomNumber);

    if (room.length < 1) {
      throw new ForbiddenException({
        statusCode: HttpStatus.FORBIDDEN,
        message: ['Not Existed Room'],
        error: 'Forbidden',
      });
    }

    if (room[0].currentPatient >= room[0].limitPatient) {
      throw new ForbiddenException({
        statusCode: HttpStatus.FORBIDDEN,
        message: ['병실 수용 가능 인원이 가득 찼습니다.'],
        error: 'Forbidden',
      });
    }

    const isExist = await this.patientRepository.findOneBy({
      infoNumber: requestDto.infoNumber,
    });

    if (isExist) {
      throw new ForbiddenException({
        statusCode: HttpStatus.FORBIDDEN,
        message: ['이미 등록된 환자입니다'],
        error: 'Forbidden',
      });
    }

    const { id, name, patNumber, infoNumber } =
      await this.patientRepository.save({
        hospital: hospital,
        ward: ward[0],
        room: room[0],
        ...requestDto,
      });

    await this.roomRepository.update(room[0].id, {
      currentPatient: room[0].currentPatient + 1,
    });

    const result = {
      id: id,
      name: name,
      patNumber: patNumber,
      infoNumber: infoNumber,
    };

    return result;
  }
}
