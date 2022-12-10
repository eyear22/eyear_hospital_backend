import {
  BadRequestException,
  ForbiddenException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateHospitalDto } from './dto/request-dto/create-hospital.dto';
import { Hospital } from './entities/hospital.entity';
import { hash } from 'bcrypt';
import { IdCheckDto } from './dto/request-dto/id-check.dto';
import { CreateWardDto } from './dto/request-dto/create-ward.dto';
import { Ward } from './entities/ward.entity';
import { CreateRoomDto } from './dto/request-dto/create-room.dto';
import { Room } from './entities/room.entity';
import { Patient } from './entities/patient.entity';
import { CreatePatientDto } from './dto/request-dto/create-patient.dto';
import { ChangeStateDto } from './dto/request-dto/change-state.dto';
import { Reservation } from 'src/reservation/entities/reservation.entity';

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
    @InjectRepository(Reservation)
    private reservationRepository: Repository<Reservation>,
  ) {
    this.hospitalRepository = hospitalRepository;
    this.wardRepository = wardRepository;
    this.roomRepository = roomRepository;
    this.patientRepository = patientRepository;
    this.reservationRepository = reservationRepository;
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

    const { password, currentHashedRefreshToken, ...result } =
      await this.hospitalRepository.save(requestDto);
    return result;
  }

  async idCheck(requestDto: IdCheckDto) {
    const isExist = await this.hospitalRepository.findOneBy({
      hospitalId: requestDto.hospitalId,
    });

    if (isExist) {
      return {
        result: true,
        text: '이미 존재하는 아이디입니다.',
      };
    }

    return {
      result: false,
      text: '사용 가능한 아이디입니다.',
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
    if (ward.length < 1) {
      throw new ForbiddenException({
        statusCode: HttpStatus.FORBIDDEN,
        message: ['병동 정보가 올바르지 않습니다.'],
        error: 'Forbidden',
      });
    }

    const room = await this.findRoom(ward[0].id, requestDto.roomNumber);
    if (room.length < 1) {
      throw new ForbiddenException({
        statusCode: HttpStatus.FORBIDDEN,
        message: ['병실 정보가 올바르지 않습니다.'],
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

  async getMainData(hospitalId: string) {
    const OFFSET = 1000 * 60 * 60 * 9;
    const day = new Date(new Date().getTime() + OFFSET);
    day.setDate(day.getDate() - 1);
    const yesterday = day.toISOString().split('T')[0];

    const posts = await this.hospitalRepository
      .createQueryBuilder('hospital')
      .select('post.id')
      .addSelect('post.check')
      .addSelect('post.patientId')
      .leftJoin('hospital.posts', 'post')
      .where('hospital.hospitalId = :hospitalId', { hospitalId })
      .andWhere('date_format(post.createdAt, "%Y-%m-%d") = :yesterday', {
        yesterday,
      })
      .execute();

    for (const index in posts) {
      const patient = await this.patientRepository.findOne({
        where: {
          id: posts[index].patient_id,
        },
        relations: ['ward', 'room'],
      });

      if (patient) {
        posts[index]['patient_name'] = patient.name;
        posts[index]['patient_number'] = patient.patNumber;
        posts[index]['patient_ward'] = patient.ward.name;
        posts[index]['patient_roomNumber'] = patient.room.roomNumber;
      }
    }
    return posts;
  }

  async getPatients(hospitalId: string) {
    const patients = await this.patientRepository
      .createQueryBuilder('patient')
      .select('patient.id')
      .addSelect('patient.name')
      .addSelect('patient.patNumber')
      .addSelect('patient.inDate')
      .addSelect('ward.name')
      .addSelect('room.roomNumber')
      .leftJoin('patient.hospital', 'hospital')
      .leftJoin('patient.ward', 'ward')
      .leftJoin('patient.room', 'room')
      .where('hospital.hospitalId = :hospitalId', { hospitalId })
      .execute();

    return patients;
  }

  async changeReservationState(hospitalId: string, requestDto: ChangeStateDto) {
    const reservation = await this.reservationRepository.findOneBy({
      id: requestDto.reservationId,
    });

    if (!reservation) {
      throw new BadRequestException({
        statusCode: HttpStatus.BAD_REQUEST,
        message: ['존재하지 않는 예약입니다.'],
        error: 'BAD_REQUEST',
      });
    }

    if (reservation.approveCheck != 0) {
      throw new BadRequestException({
        statusCode: HttpStatus.BAD_REQUEST,
        message: ['이미 승인 여부가 결정된 예약입니다.'],
        error: 'BAD_REQUEST',
      });
    }
    const updateResult = await this.reservationRepository.update(
      { id: requestDto.reservationId },
      {
        approveCheck: requestDto.state,
      },
    );

    if (updateResult.affected == 1) {
      return {
        reservationId: requestDto.reservationId,
        state: requestDto.state == 1 ? '예약 승인' : '예약 거부',
      };
    }
  }

  async getWardList(hospitalId: string) {
    const wards = await this.wardRepository
      .createQueryBuilder('ward')
      .select('ward.id')
      .addSelect('ward.name')
      .leftJoin('ward.hospital', 'hospital')
      .where('hospital.hospitalId = :hospitalId', { hospitalId })
      .execute();

    return wards;
  }

  async getRoomList(hospitalId: string) {
    const wards = await this.getWardList(hospitalId);
    const result = [];

    for (const ward of wards) {
      const wardId = ward.ward_id;

      const rooms = await this.roomRepository
        .createQueryBuilder('room')
        .select('room.id')
        .addSelect('room.roomNumber')
        .addSelect('room.createdAt')
        .addSelect('room.currentPatient')
        .addSelect('room.icuCheck')
        .leftJoin('room.ward', 'ward')
        .where('ward.id = :wardId', { wardId })
        .execute();

      for (const room of rooms) {
        result.push({
          ward_id: ward.ward_id,
          ward_name: ward.ward_name,
          room_id: room.room_id,
          room_createdAt: room.room_createdAt,
          room_number: room.room_roomNumber,
          room_currentPatient: room.room_currentPatient,
          room_icuCheck: room.room_icuCheck,
        });
      }
    }
    return result;
  }

  async getReservationList(hospitalId: string, date: Date) {
    const reservations = await this.reservationRepository
      .createQueryBuilder('reservation')
      .select('reservation.id')
      .addSelect('reservation.createdAt')
      .addSelect('reservation.reservationDate')
      .addSelect('reservation.faceToface')
      .addSelect('reservation.approveCheck')
      .addSelect('reservation.patientId')
      .leftJoin('reservation.hospital', 'hospital')
      .where('hospital.hospitalId = :hospitalId', { hospitalId })
      .andWhere(
        'date_format(reservation.reservationDate, "%Y-%m-%d") = :date',
        {
          date,
        },
      )
      .execute();

    return reservations;
  }
}
