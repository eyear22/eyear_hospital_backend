import {
  BadRequestException,
  ForbiddenException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ChangeStateDto } from '../hospital/dto/request-dto/change-state.dto';
import { Hospital } from '../hospital/entities/hospital.entity';
import { Repository } from 'typeorm';
import { Reservation } from './entities/reservation.entity';

@Injectable()
export class ReservationService {
  constructor(
    @InjectRepository(Reservation)
    private reservationRepository: Repository<Reservation>,
    @InjectRepository(Hospital)
    private hospitalRepository: Repository<Hospital>,
  ) {
    this.reservationRepository = reservationRepository;
    this.hospitalRepository = hospitalRepository;
  }

  formatDate(dateData: Date) {
    const temp = dateData.toISOString().split('T')[0];
    const temp2 = temp.split('-');

    return temp2[0].substring(2) + '/' + temp2[1] + '/' + temp2[2];
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

  async getAllReservation(hospitalId: string) {
    const hospital = await this.findHospital(hospitalId);

    const reservations = await this.reservationRepository
      .createQueryBuilder('reservation')
      .select('reservation.id')
      .addSelect('reservation.createdAt')
      .addSelect('reservation.reservationDate')
      .addSelect('reservation.timetableIndex')
      .addSelect('reservation.faceToface')
      .addSelect('reservation.approveCheck')
      .addSelect('patient.patNumber')
      .addSelect('patient.name')
      .addSelect('room.roomNumber')
      .addSelect('ward.name')
      .leftJoin('reservation.patient', 'patient')
      .leftJoin('patient.room', 'room')
      .leftJoin('room.ward', 'ward')
      .where('reservation.hospitalId =:hospitalId ', {
        hospitalId: hospital.id,
      })
      .orderBy('reservation.reservationDate', 'ASC')
      .addOrderBy('reservation.timetableIndex', 'ASC')
      .execute();

    const result = { '-1': [], '0': [], '1': [] };

    for (const reservation of reservations) {
      reservation.reservation_createdAt = this.formatDate(
        reservation.reservation_createdAt,
      );

      reservation.reservation_reservationDate = this.formatDate(
        reservation.reservation_reservationDate,
      );

      result[reservation.reservation_approveCheck].push(reservation);
    }

    return result;
  }

  async getReservationList(hospitalId: string, date: Date) {
    const hospital = await this.findHospital(hospitalId);

    const reservations = await this.reservationRepository
      .createQueryBuilder('reservation')
      .select('reservation')
      .where('reservation.hospitalId =:hospitalId ', {
        hospitalId: hospital.id,
      })
      .andWhere(
        'date_format(reservation.reservationDate, "%Y-%m-%d") = :date',
        {
          date,
        },
      )
      .execute();

    for (const reservation of reservations) {
      reservation.reservation_createdAt = this.formatDate(
        reservation.reservation_createdAt,
      );

      reservation.reservation_reservationDate = this.formatDate(
        reservation.reservation_reservationDate,
      );

      reservation.reservation_updatedAt = this.formatDate(
        reservation.reservation_updatedAt,
      );
    }

    return reservations;
  }

  async changeReservationState(hospitalId: string, requestDto: ChangeStateDto) {
    const reservation = await this.reservationRepository.findOne({
      where: {
        id: requestDto.reservationId,
        hospital: { hospitalId: hospitalId },
      },
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

    await this.reservationRepository.update(
      { id: requestDto.reservationId },
      {
        approveCheck: requestDto.state,
      },
    );

    return {
      reservationId: requestDto.reservationId,
      state: requestDto.state == 1 ? '예약 승인' : '예약 거부',
    };
  }
}
