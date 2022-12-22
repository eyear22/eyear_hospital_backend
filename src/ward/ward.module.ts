import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Ward } from './entities/ward.entity';
import { WardController } from './ward.controller';
import { WardService } from './ward.service';

@Module({
  imports: [TypeOrmModule.forFeature([Ward])],
  controllers: [WardController],
  providers: [WardService],
})
export class WardModule {}
