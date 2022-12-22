import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Hospital } from 'src/hospital/entities/hospital.entity';
import { Ward } from './entities/ward.entity';
import { WardController } from './ward.controller';
import { WardService } from './ward.service';

@Module({
  imports: [TypeOrmModule.forFeature([Ward, Hospital])],
  controllers: [WardController],
  providers: [WardService],
})
export class WardModule {}
