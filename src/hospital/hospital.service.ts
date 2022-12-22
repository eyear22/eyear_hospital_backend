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
import { Ward } from '../ward/entities/ward.entity';
import { Room } from '../room/entities/room.entity';
import { Patient } from '../patient/entities/patient.entity';
import { CreatePatientDto } from '../patient/dto/request-dto/create-patient.dto';
import { Reservation } from '../reservation/entities/reservation.entity';
import { UpdatePatientDto } from '../patient/dto/request-dto/update-patient.dto';
import { DeletePatientDto } from '../patient/dto/request-dto/delete-patient.dto';

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

  async getMainData(hospitalId: string) {
    const OFFSET = 1000 * 60 * 60 * 9;
    const day = new Date(new Date().getTime() + OFFSET);
    const today = day.toISOString().split('T')[0];

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

    const reservations = await this.reservationRepository
      .createQueryBuilder('reservation')
      .select('reservation.createdAt')
      .addSelect('reservation.reservationDate')
      .addSelect('reservation.timetableIndex')
      .addSelect('patient.patNumber')
      .addSelect('patient.name')
      .addSelect('ward.name')
      .addSelect('room.roomNumber')
      .leftJoin('reservation.hospital', 'hospital')
      .leftJoin('reservation.patient', 'patient')
      .leftJoin('patient.room', 'room')
      .leftJoin('patient.ward', 'ward')
      .where('hospital.hospitalId =:hospitalId', { hospitalId })
      .andWhere(
        'date_format(reservation.reservationDate, "%Y-%m-%d") = :today',
        {
          today,
        },
      )
      .andWhere('reservation.faceToface =:faceToface', { faceToface: false })
      .andWhere('reservation.approveCheck =:approveCheck', {
        approveCheck: 1,
      })
      .execute();

    for (const reservation of reservations) {
      const createdAt_temp = reservation.reservation_createdAt
        .toISOString()
        .split('T')[0];
      const createdAt_temp2 = createdAt_temp.split('-');
      reservation.reservation_createdAt =
        createdAt_temp2[0].substring(2) +
        '/' +
        createdAt_temp2[1] +
        '/' +
        createdAt_temp2[2];

      const reservationDate_temp = reservation.reservation_reservationDate
        .toISOString()
        .split('T')[0];
      const reservationDate_temp2 = reservationDate_temp.split('-');
      reservation.reservation_reservationDate =
        reservationDate_temp2[0].substring(2) +
        '/' +
        reservationDate_temp2[1] +
        '/' +
        reservationDate_temp2[2];
    }

    return { posts: posts, reservations: reservations };
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
}
