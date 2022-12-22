import { Module } from '@nestjs/common';
import { HospitalService } from './hospital.service';
import { HospitalController } from './hospital.controller';
import { Hospital } from './entities/hospital.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Ward } from '../ward/entities/ward.entity';
import { Room } from '../room/entities/room.entity';
import { Patient } from '../patient/entities/patient.entity';
import { Reservation } from '../reservation/entities/reservation.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Hospital, Ward, Room, Patient, Reservation]),
  ],
  providers: [HospitalService],
  controllers: [HospitalController],
})
export class HospitalModule {}
