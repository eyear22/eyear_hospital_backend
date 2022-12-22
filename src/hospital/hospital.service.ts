import { ForbiddenException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateHospitalDto } from './dto/request-dto/create-hospital.dto';
import { Hospital } from './entities/hospital.entity';
import { hash } from 'bcrypt';
import { IdCheckDto } from './dto/request-dto/id-check.dto';
import { Reservation } from '../reservation/entities/reservation.entity';
import { Post } from 'src/post/entities/post.entity';

@Injectable()
export class HospitalService {
  constructor(
    @InjectRepository(Hospital)
    private hospitalRepository: Repository<Hospital>,
    @InjectRepository(Reservation)
    private reservationRepository: Repository<Reservation>,
  ) {
    this.hospitalRepository = hospitalRepository;
    this.reservationRepository = reservationRepository;
  }

  OFFSET = 1000 * 60 * 60 * 9;

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

  async getMainData(hospitalId: string) {
    const posts = await this.getTodayPosts(hospitalId);
    const reservations = await this.getTodayReservations(hospitalId);

    return { posts: posts, reservations: reservations };
  }

  async getTodayPosts(hospitalId: string): Promise<Post> {
    const day = new Date(new Date().getTime() + this.OFFSET);
    day.setDate(day.getDate() - 1);
    const yesterday = day.toISOString().split('T')[0];

    const posts = await this.hospitalRepository
      .createQueryBuilder('hospital')
      .select('post.id')
      .addSelect('post.check')
      .addSelect('patient.id')
      .addSelect('patient.name')
      .addSelect('patient.patNumber')
      .addSelect('room.roomNumber')
      .addSelect('ward.name')
      .leftJoin('hospital.posts', 'post')
      .leftJoin('post.patient', 'patient')
      .leftJoin('patient.room', 'room')
      .leftJoin('patient.ward', 'ward')
      .where('hospital.hospitalId = :hospitalId', { hospitalId })
      .andWhere('date_format(post.createdAt, "%Y-%m-%d") = :yesterday', {
        yesterday,
      })
      .execute();

    return posts;
  }

  async getTodayReservations(hospitalId: string): Promise<Reservation> {
    const day = new Date(new Date().getTime() + this.OFFSET);
    const today = day.toISOString().split('T')[0];

    const reservations = await this.reservationRepository
      .createQueryBuilder('reservation')
      .select('reservation.createdAt')
      .addSelect('reservation.reservationDate')
      .addSelect('reservation.timetableIndex')
      .addSelect('reservation.faceToface')
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
      .andWhere('reservation.approveCheck =:approveCheck', {
        approveCheck: 1,
      })
      .execute();

    for (const reservation of reservations) {
      reservation.reservation_createdAt = this.formatDate(
        reservation.reservation_createdAt,
      );

      reservation.reservation_reservationDate = this.formatDate(
        reservation.reservation_reservationDate,
      );
    }

    return reservations;
  }

  formatDate(data: Date): string {
    const temp = data.toISOString().split('T')[0];
    const temp2 = temp.split('-');

    return temp2[0].substring(2) + '/' + temp2[1] + '/' + temp2[2];
  }
}
