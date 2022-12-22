import { Module } from '@nestjs/common';
import { HospitalService } from './hospital.service';
import { HospitalController } from './hospital.controller';
import { Hospital } from './entities/hospital.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Reservation } from '../reservation/entities/reservation.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Hospital, Reservation])],
  providers: [HospitalService],
  controllers: [HospitalController],
})
export class HospitalModule {}
