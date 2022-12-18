import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Hospital } from '../hospital/entities/hospital.entity';
import { Repository } from 'typeorm';
import { Reservation } from './entities/reservation.entity';
import { ReservationService } from './reservation.service';

const mockRepository = () => ({
  findOneBy: jest.fn(),
  findOne: jest.fn(),
  update: jest.fn(),
  save: jest.fn(),
  createQueryBuilder: jest.fn(() => ({
    where: jest.fn().mockReturnThis(),
    andWhere: jest.fn().mockReturnThis(),
    leftJoin: jest.fn().mockReturnThis(),
    getOne: jest.fn().mockReturnThis(),
  })),
});

type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;

describe('ReservationService', () => {
  let service: ReservationService;
  let reservationRepository: MockRepository<Reservation>;
  let hospitalRepository: MockRepository<Hospital>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReservationService,
        {
          provide: getRepositoryToken(Reservation),
          useValue: mockRepository(),
        },
        {
          provide: getRepositoryToken(Hospital),
          useValue: mockRepository(),
        },
      ],
    }).compile();

    service = module.get<ReservationService>(ReservationService);
    reservationRepository = module.get(getRepositoryToken(Reservation));
    hospitalRepository = module.get(getRepositoryToken(Hospital));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('update reservation state', () => {
    it('update success', async () => {
      const before = {
        id: 1,
        reservationDate: new Date('2022-12-12'),
        timetableIndex: 1,
        faceToface: true,
        approveCheck: 0,
      };

      reservationRepository.findOne.mockResolvedValue(before);

      const after = {
        reservationId: 1,
        state: 1,
      };

      const result = await service.changeReservationState('test_id', after);
      expect(reservationRepository.update).toHaveBeenCalledTimes(1);
      expect(result).toEqual({ reservationId: 1, state: '예약 승인' });
    });
  });
});
