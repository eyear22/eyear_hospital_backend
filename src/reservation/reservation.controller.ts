import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Put,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ChangeStateDto } from './dto/request-dto/change-state.dto';
import { ReservationParamDto } from './dto/request-dto/reservation-param.dto';
import { ChangeStateResponse } from './dto/response-dto/change-state-response.dto';
import { ReservationListResponse } from './dto/response-dto/reservation-list-response.dto';
import { ReservationService } from './reservation.service';

@Controller('')
@ApiTags('Reservation API')
export class ReservationController {
  constructor(private readonly reservationService: ReservationService) {}

  @Get('hospital/allReservation')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: '전체 면회 리스트 확인 API',
    description: '전체 면회 리스트 확인 API',
  })
  @ApiOkResponse({
    description: 'success',
    type: ReservationListResponse,
  })
  async getAllReservation(@Req() req: Request, @Res() res: Response) {
    const reservations = await this.reservationService.getAllReservation(
      req.user.hospitalId,
    );
    const result = {
      message: 'success',
      reservations: reservations,
    };
    return res.status(HttpStatus.OK).json(result);
  }

  @Get('hospital/reservationList/:reservationDate')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: '특정 날짜의 면회 리스트 확인 API',
    description:
      '특정 날짜의 면회 리스트 확인 API --> 승인 여부에 상관없이 모든 리스트를 보냄',
  })
  @ApiOkResponse({
    description: 'success',
    type: ReservationListResponse,
  })
  async getReservationList(
    @Param() param: ReservationParamDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const reservations =
      await this.reservationService.getReservationsOnSpecificDate(
        req.user.hospitalId,
        param.reservationDate,
      );
    const result = {
      message: 'success',
      reservations: reservations,
    };
    return res.status(HttpStatus.OK).json(result);
  }

  @Put('hospital/changeReservationState')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: '예약 승인 여부 결정 API',
    description: '예약 승인 여부 결정 API',
  })
  @ApiOkResponse({
    description: 'success',
    type: ChangeStateResponse,
  })
  async changeReservationState(
    @Req() req: Request,
    @Res() res: Response,
    @Body() requestDto: ChangeStateDto,
  ) {
    const reservation = await this.reservationService.changeReservationState(
      req.user.hospitalId,
      requestDto,
    );
    const result = {
      message: 'success',
      result: reservation,
    };
    return res.status(HttpStatus.OK).json(result);
  }
}
