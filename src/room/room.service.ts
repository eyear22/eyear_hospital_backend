import {
  BadRequestException,
  ForbiddenException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FormatDate } from 'src/util/formatDate';
import { Ward } from 'src/ward/entities/ward.entity';
import { Repository } from 'typeorm';
import { CreateRoomDto } from './dto/request-dto/create-room.dto';
import { DeleteRoomDto } from './dto/request-dto/delete-room.dto';
import { UpdateRoomDto } from './dto/request-dto/update-room.dto';
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

  async getRoomList(hospitalId: string) {
    const wards = await this.wardRepositoty.find({
      where: { hospital: { hospitalId: hospitalId } },
    });

    const result = [];

    for (const ward of wards) {
      const rooms = await this.roomRepository.find({
        where: { ward: { id: ward.id } },
      });

      for (const room of rooms) {
        result.push({
          ward_id: ward.id,
          ward_name: ward.name,
          room_id: room.id,
          room_createdAt: FormatDate.formatDate(room.createdAt),
          room_number: room.roomNumber,
          room_currentPatient: room.currentPatient,
          room_icuCheck: room.icuCheck,
        });
      }
    }
    return result;
  }

  async updateRoom(hospitalId: string, requestDto: UpdateRoomDto) {
    const { id, wardName, ...updateData } = requestDto;
    const room = await this.roomRepository.findOne({
      where: {
        id: id,
        ward: { name: wardName },
        hospital: { hospitalId: hospitalId },
      },
    });

    if (room === null) {
      throw new BadRequestException({
        statusCode: HttpStatus.BAD_REQUEST,
        message: ['존재하지 않는 병실입니다.'],
        error: 'BAD_REQUEST',
      });
    }

    await this.roomRepository.update({ id }, updateData);
    return requestDto;
  }

  async deleteRoom(hospitalId: string, requestDto: DeleteRoomDto) {
    const room = await this.roomRepository.findOne({
      where: {
        id: requestDto.id,
        hospital: { hospitalId: hospitalId },
      },
    });

    if (room === null) {
      throw new BadRequestException({
        statusCode: HttpStatus.BAD_REQUEST,
        message: ['존재하지 않는 병실입니다.'],
        error: 'BAD_REQUEST',
      });
    }

    await this.roomRepository.delete({ id: requestDto.id });
    return 'success';
  }
}
