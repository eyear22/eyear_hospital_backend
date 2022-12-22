import {
  BadRequestException,
  ForbiddenException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Room } from 'src/room/entities/room.entity';
import { Ward } from 'src/ward/entities/ward.entity';
import { Repository } from 'typeorm';
import { CreatePatientDto } from './dto/request-dto/create-patient.dto';
import { DeletePatientDto } from './dto/request-dto/delete-patient.dto';
import { UpdatePatientDto } from './dto/request-dto/update-patient.dto';
import { Patient } from './entities/patient.entity';

@Injectable()
export class PatientService {
  constructor(
    @InjectRepository(Patient)
    private patientRepository: Repository<Patient>,
    @InjectRepository(Ward)
    private wardRepository: Repository<Ward>,
    @InjectRepository(Room)
    private roomRepository: Repository<Room>,
  ) {
    this.patientRepository = patientRepository;
    this.wardRepository = wardRepository;
    this.roomRepository = roomRepository;
  }

  async createPatient(requestDto: CreatePatientDto, hospitalId: string) {
    const ward = await this.wardRepository.findOne({
      where: {
        name: requestDto.wardName,
        hospital: { hospitalId: hospitalId },
      },
      relations: ['hospital'],
    });

    if (ward === null) {
      throw new BadRequestException({
        statusCode: HttpStatus.BAD_REQUEST,
        message: ['유효하지 않은 병동 정보입니다.'],
        error: 'BAD_REQUEST',
      });
    }

    const room = await this.roomRepository.findOne({
      where: { roomNumber: requestDto.roomNumber, ward: { id: ward.id } },
    });

    if (room === null) {
      throw new BadRequestException({
        statusCode: HttpStatus.BAD_REQUEST,
        message: ['유효하지 않은 병실 정보입니다.'],
        error: 'BAD_REQUEST',
      });
    }

    const isExist = await this.patientRepository.findOne({
      where: {
        name: requestDto.name,
        infoNumber: requestDto.infoNumber,
        hospital: { hospitalId: hospitalId },
      },
    });

    if (isExist) {
      throw new BadRequestException({
        statusCode: HttpStatus.BAD_REQUEST,
        message: ['이미 등록된 환자입니다.'],
        error: 'BAD_REQUEST',
      });
    }

    if (room.currentPatient >= room.limitPatient) {
      throw new ForbiddenException({
        statusCode: HttpStatus.FORBIDDEN,
        message: ['병실 수용 가능 인원이 가득 찼습니다.'],
        error: 'Forbidden',
      });
    }

    const { id, name, patNumber, infoNumber } =
      await this.patientRepository.save({
        hospital: ward.hospital,
        ward: ward,
        room: room,
        ...requestDto,
      });

    await this.roomRepository.update(room.id, {
      currentPatient: room.currentPatient + 1,
    });

    const result = {
      id: id,
      name: name,
      patNumber: patNumber,
      infoNumber: infoNumber,
    };

    return result;
  }

  async getPatients(hospitalId: string): Promise<any> {
    const patients = await this.patientRepository.find({
      where: { hospital: { hospitalId: hospitalId } },
      relations: ['ward', 'room'],
    });

    const result = [];
    for (const patient of patients) {
      const birth_temp = patient.birth.toISOString().split('T')[0];
      const birth_temp2 = birth_temp.split('-');
      const birth =
        birth_temp2[0].substring(2) + birth_temp2[1] + birth_temp2[2];

      const inDate_temp = patient.inDate.toISOString().split('T')[0];
      const inDate_temp2 = inDate_temp.split('-');
      const inDate =
        inDate_temp2[0].substring(2) +
        '/' +
        inDate_temp2[1] +
        '/' +
        inDate_temp2[2];

      result.push({
        patient_id: patient.id,
        patient_name: patient.name,
        patient_patNumber: patient.patNumber,
        patient_inDate: inDate,
        patient_birth: birth,
        ward_name: patient.ward.name,
        room_roomNumber: patient.room.roomNumber,
      });
    }

    return result;
  }

  async updatePatient(requestDto: UpdatePatientDto, hospitalId: string) {
    const { id, ...updateData } = requestDto;
    const patient = await this.patientRepository.findOne({
      where: { id: id, hospital: { hospitalId: hospitalId } },
    });

    if (patient === null) {
      throw new BadRequestException({
        statusCode: HttpStatus.BAD_REQUEST,
        message: ['유효하지 않은 환자에 대한 요청입니다.'],
        error: 'BAD_REQUEST',
      });
    }

    await this.patientRepository.update({ id }, updateData);
    return requestDto;
  }

  async deletePatient(requestDto: DeletePatientDto, hospitalId: string) {
    const patient = await this.patientRepository.findOne({
      where: { id: requestDto.id, hospital: { hospitalId: hospitalId } },
    });

    if (patient === null) {
      throw new BadRequestException({
        statusCode: HttpStatus.BAD_REQUEST,
        message: ['유효하지 않은 환자에 대한 요청입니다.'],
        error: 'BAD_REQUEST',
      });
    }

    await this.patientRepository.delete({ id: requestDto.id });
    return 'success';
  }
}
