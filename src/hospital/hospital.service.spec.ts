import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Reservation } from '../reservation/entities/reservation.entity';
import { Hospital } from './entities/hospital.entity';
import { Patient } from './entities/patient.entity';
import { Room } from './entities/room.entity';
import { Ward } from './entities/ward.entity';
import { HospitalService } from './hospital.service';

const mockRepository = () => ({});

describe('HospitalService', () => {
  let service: HospitalService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        HospitalService,
        {
          provide: getRepositoryToken(Hospital),
          useValue: mockRepository(),
        },
        {
          provide: getRepositoryToken(Reservation),
          useValue: mockRepository(),
        },
        {
          provide: getRepositoryToken(Ward),
          useValue: mockRepository(),
        },
        {
          provide: getRepositoryToken(Room),
          useValue: mockRepository(),
        },
        {
          provide: getRepositoryToken(Patient),
          useValue: mockRepository(),
        },
      ],
    }).compile();

    service = module.get<HospitalService>(HospitalService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
