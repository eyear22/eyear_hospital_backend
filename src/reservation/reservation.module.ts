import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Hospital } from '../hospital/entities/hospital.entity';
import { Reservation } from './entities/reservation.entity';
import { ReservationController } from './reservation.controller';
import { ReservationService } from './reservation.service';

@Module({
  imports: [TypeOrmModule.forFeature([Hospital, Reservation])],
  controllers: [ReservationController],
  providers: [ReservationService],
})
export class ReservationModule {}
