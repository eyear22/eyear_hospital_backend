import { Module } from '@nestjs/common';
import { PatientService } from './patient.service';
import { PatientController } from './patient.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Patient } from './entities/patient.entity';
import { Ward } from 'src/ward/entities/ward.entity';
import { Room } from 'src/room/entities/room.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Patient, Ward, Room])],
  providers: [PatientService],
  controllers: [PatientController],
})
export class PatientModule {}
