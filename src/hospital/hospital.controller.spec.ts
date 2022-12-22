import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Reservation } from '../reservation/entities/reservation.entity';
import { Hospital } from './entities/hospital.entity';
import { Patient } from '../patient/entities/patient.entity';
import { Room } from '../room/entities/room.entity';
import { Ward } from '../ward/entities/ward.entity';
import { HospitalController } from './hospital.controller';
import { HospitalService } from './hospital.service';

describe('HospitalController', () => {
  let controller: HospitalController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HospitalController],
      providers: [
        HospitalService,
        {
          provide: getRepositoryToken(Hospital),
          useValue: {},
        },
        {
          provide: getRepositoryToken(Room),
          useValue: {},
        },
        {
          provide: getRepositoryToken(Patient),
          useValue: {},
        },
        {
          provide: getRepositoryToken(Reservation),
          useValue: {},
        },
        {
          provide: getRepositoryToken(Ward),
          useValue: {},
        },
      ],
    }).compile();

    controller = module.get<HospitalController>(HospitalController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
