import { Module } from '@nestjs/common';
import { HospitalService } from './hospital.service';
import { HospitalController } from './hospital.controller';
import { Hospital } from './entities/hospital.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Ward } from './entities/ward.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Hospital, Ward])],
  providers: [HospitalService],
  controllers: [HospitalController],
})
export class HospitalModule {}
