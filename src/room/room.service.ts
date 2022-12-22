import {
  BadRequestException,
  ForbiddenException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Ward } from 'src/ward/entities/ward.entity';
import { Repository } from 'typeorm';
import { CreateRoomDto } from './dto/request-dto/create-room.dto';
import { Room } from './entities/room.entity';

@Injectable()
export class RoomService {
  constructor(
    @InjectRepository(Room)
    private roomRepository: Repository<Room>,
    @InjectRepository(Ward)
    private wardRepositoty: Repository<Ward>,
  ) {
    this.roomRepository = roomRepository;
    this.wardRepositoty = wardRepositoty;
  }

  async createRoom(requestDto: CreateRoomDto, hospitalId: string) {
    const ward = await this.wardRepositoty.findOne({
      where: {
        name: requestDto.wardName,
        hospital: { hospitalId: hospitalId },
      },
    });

    if (ward === null) {
      throw new BadRequestException({
        statusCode: HttpStatus.BAD_REQUEST,
        message: ['Not Existed Ward'],
        error: 'BAD_REQUEST',
      });
    }

    const isExist = await this.roomRepository.findOne({
      where: { roomNumber: requestDto.roomNumber, ward: { id: ward.id } },
    });

    if (isExist) {
      throw new ForbiddenException({
        statusCode: HttpStatus.FORBIDDEN,
        message: ['Already registered room'],
        error: 'Forbidden',
      });
    }

    const { id, roomNumber } = await this.roomRepository.save({
      ward: ward,
      currentPatient: 0,
      ...requestDto,
    });

    const result = {
      id: id,
      roomNumber: roomNumber,
    };
    return result;
  }
}
