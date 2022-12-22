import { BadRequestException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ChangeStateDto } from './dto/request-dto/change-state.dto';
import { Repository } from 'typeorm';
import { Reservation } from './entities/reservation.entity';
import { FormatDate } from 'src/util/formatDate';

@Injectable()
export class ReservationService {
  constructor(
    @InjectRepository(Reservation)
    private reservationRepository: Repository<Reservation>,
  ) {
    this.reservationRepository = reservationRepository;
  }

  reservationResultFormat(reservations: any) {
    const result = { '-1': [], '0': [], '1': [] };

    for (const reservation of reservations) {
      reservation.reservation_createdAt = FormatDate.formatDate(
        reservation.reservation_createdAt,
      );

      reservation.reservation_reservationDate = FormatDate.formatDate(
        reservation.reservation_reservationDate,
      );

      result[reservation.reservation_approveCheck].push(reservation);
    }

    return result;
  }

  async getAllReservation(hospitalId: string) {
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
      .leftJoin('reservation.hospital', 'hospital')
      .where('hospital.hospitalId =:hospitalId ', {
        hospitalId,
      })
      .orderBy('reservation.reservationDate', 'ASC')
      .addOrderBy('reservation.timetableIndex', 'ASC')
      .execute();

    return this.reservationResultFormat(reservations);
  }

  async getReservationsOnSpecificDate(hospitalId: string, date: Date) {
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
      .leftJoin('reservation.hospital', 'hospital')
      .where('hospital.hospitalId =:hospitalId ', {
        hospitalId,
      })
      .andWhere(
        'date_format(reservation.reservationDate, "%Y-%m-%d") = :date',
        {
          date,
        },
      )
      .orderBy('reservation.reservationDate', 'ASC')
      .addOrderBy('reservation.timetableIndex', 'ASC')
      .execute();

    return this.reservationResultFormat(reservations);
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
