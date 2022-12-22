import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Post,
  Put,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CreateRoomDto } from './dto/request-dto/create-room.dto';
import { CreateRoomResponse } from './dto/response-dto/create-room-response.dto';
import { RoomService } from './room.service';
import { Request, Response } from 'express';
import { UpdateRoomResponse } from './dto/response-dto/update-room-response.dto';
import { UpdateRoomDto } from './dto/request-dto/update-room.dto';
import { BaseResponse } from 'src/util/swagger/base-response.dto';
import { DeleteRoomDto } from './dto/request-dto/delete-room.dto';
import { RoomListResponse } from './dto/response-dto/room-list-response.dto';

@Controller('')
export class RoomController {
  constructor(private readonly roomService: RoomService) {}

  @Post('hospital/room')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: '병실 등록',
    description: '병실 등록',
  })
  @ApiCreatedResponse({
    status: HttpStatus.CREATED,
    description: 'success',
    type: CreateRoomResponse,
  })
  async createRoom(
    @Body() requestDto: CreateRoomDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const room = await this.roomService.createRoom(
      requestDto,
      req.user.hospitalId,
    );
    const result = {
      message: 'success',
      room: room,
    };
    return res.status(HttpStatus.CREATED).json(result);
  }

  @Get('hospital/roomList')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: '병실 리스트 API',
    description: '병실 리스트 API',
  })
  @ApiOkResponse({
    description: 'success',
    type: RoomListResponse,
  })
  async getRoomList(@Req() req: Request, @Res() res: Response) {
    const rooms = await this.roomService.getRoomList(req.user.hospitalId);
    const result = {
      message: 'success',
      rooms: rooms,
    };
    return res.status(HttpStatus.OK).json(result);
  }

  @Put('hospital/room')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: '병실 수정 API',
    description: '병실 수정 API',
  })
  @ApiOkResponse({
    description: 'success',
    type: UpdateRoomResponse,
  })
  async updateRoom(
    @Req() req: Request,
    @Res() res: Response,
    @Body() requestDto: UpdateRoomDto,
  ) {
    const room = await this.roomService.updateRoom(
      req.user.hospitalId,
      requestDto,
    );
    const result = {
      message: 'success',
      room: room,
    };
    return res.status(HttpStatus.OK).json(result);
  }

  @Delete('hospital/room')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: '병실 삭제 API',
    description: '병실 삭제 API',
  })
  @ApiOkResponse({
    description: 'success',
    type: BaseResponse,
  })
  async deleteRoom(
    @Req() req: Request,
    @Res() res: Response,
    @Body() requestDto: DeleteRoomDto,
  ) {
    const deleteResult = await this.roomService.deleteRoom(
      req.user.hospitalId,
      requestDto,
    );

    return res.status(HttpStatus.OK).json({ message: deleteResult });
  }
}
