import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Post,
  Put,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Request, Response } from 'express';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { ChangeStateResponse } from './dto/response-dto/change-state-response.dto';
import { ChangeStateDto } from './dto/request-dto/change-state.dto';
import { CreateHospitalResponse } from './dto/response-dto/create-hospital-response.dto';
import { CreateHospitalDto } from './dto/request-dto/create-hospital.dto';
import { CreatePatientResponse } from './dto/response-dto/create-patient-response.dto';
import { CreatePatientDto } from './dto/request-dto/create-patient.dto';
import { CreateRoomResponse } from './dto/response-dto/create-room-response.dto';
import { CreateRoomDto } from './dto/request-dto/create-room.dto';
import { CreateWardResponse } from './dto/response-dto/create-ward-response.dto';
import { CreateWardDto } from './dto/request-dto/create-ward.dto';
import { HospitalMainResponse } from './dto/response-dto/hospital-main-response.dto';
import { IdCheckResponse } from './dto/response-dto/id-check-response.dto';
import { IdCheckDto } from './dto/request-dto/id-check.dto';
import { PatientListResponse } from './dto/response-dto/patient-list-response.dto';
import { HospitalService } from './hospital.service';
import { WardListResponse } from './dto/response-dto/ward-list-response.dto';
import { RoomListResponse } from './dto/response-dto/room-list-response.dto';
import { ReservationQueryDto } from './dto/request-dto/reservation-query.dto';
import { ReservationListResponse } from './dto/response-dto/reservation-list-response.dto';
import { UpdateWardResponse } from './dto/response-dto/update-ward-response.dto';
import { UpdateWardDto } from './dto/request-dto/update-ward.dto';
import { DeleteWardDto } from './dto/request-dto/delete-ward.dto';
import { BaseResponse } from 'src/util/swagger/base-response.dto';
import { UpdateRoomDto } from './dto/request-dto/update-room.dto';
import { UpdateRoomResponse } from './dto/response-dto/update-room-response.dto';
import { DeleteRoomDto } from './dto/request-dto/delete-room.dto';
import { UpdatePatientDto } from './dto/request-dto/update-patient.dto';
import { UpdatePatientResponse } from './dto/response-dto/update-patient-response.dto';
import { DeletePatientDto } from './dto/request-dto/delete-patient.dto';
import { AllReservationResponse } from './dto/response-dto/all-reservation-response.dto';

@Controller('hospital')
@ApiTags('Hospital API')
export class HospitalController {
  constructor(private readonly hospitalService: HospitalService) {}

  @Post('')
  @ApiOperation({
    summary: '병원 생성',
    description: '병원 계정을 생성한다.',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'success',
    type: CreateHospitalResponse,
  })
  async create(@Body() requestDto: CreateHospitalDto, @Res() res: Response) {
    const hospital = await this.hospitalService.create(requestDto);
    const result = {
      message: 'success',
      hospital: hospital,
    };
    return res.status(HttpStatus.CREATED).json(result);
  }

  @Get('idCheck')
  @ApiOperation({
    summary: '병원 ID 중복 체크',
    description: '병원 ID 중복 체크',
  })
  @ApiOkResponse({
    description: 'success',
    type: IdCheckResponse,
  })
  async idCheck(@Query() requestDto: IdCheckDto, @Res() res: Response) {
    const idCheck = await this.hospitalService.idCheck(requestDto);
    const result = {
      message: 'success',
      idCheck: idCheck,
    };
    return res.status(HttpStatus.OK).json(result);
  }

  @Post('ward')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: '병동 등록',
    description: '병동 등록',
  })
  @ApiCreatedResponse({
    status: HttpStatus.CREATED,
    description: 'success',
    type: CreateWardResponse,
  })
  async createWard(
    @Body() requestDto: CreateWardDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const ward = await this.hospitalService.createWard(
      requestDto,
      req.user.hospitalId,
    );
    const result = {
      message: 'success',
      ward: ward,
    };
    return res.status(HttpStatus.CREATED).json(result);
  }

  @Put('ward')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: '병동 수정',
    description: '병동 수정',
  })
  @ApiOkResponse({
    status: HttpStatus.OK,
    description: 'success',
    type: UpdateWardResponse,
  })
  async updateWard(
    @Body() requestDto: UpdateWardDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const ward = await this.hospitalService.updateWard(
      requestDto,
      req.user.hospitalId,
    );
    const result = {
      message: 'success',
      ward: ward,
    };
    return res.status(HttpStatus.OK).json(result);
  }

  @Delete('ward')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: '병동 삭제',
    description: '병동 삭제 - 병동과 연결된 병실 및 환자가 모두 삭제됩니다.',
  })
  @ApiOkResponse({
    status: HttpStatus.OK,
    description: 'success',
    type: BaseResponse,
  })
  async deleteWard(
    @Body() requestDto: DeleteWardDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const result = await this.hospitalService.deleteWard(
      requestDto,
      req.user.hospitalId,
    );

    return res.status(HttpStatus.OK).json({ message: result });
  }

  @Post('room')
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
    const room = await this.hospitalService.createRoom(
      requestDto,
      req.user.hospitalId,
    );
    const result = {
      message: 'success',
      room: room,
    };
    return res.status(HttpStatus.CREATED).json(result);
  }

  @Post('patient')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: '환자 등록',
    description: '환자 등록',
  })
  @ApiCreatedResponse({
    status: HttpStatus.CREATED,
    description: 'success',
    type: CreatePatientResponse,
  })
  async createPatient(
    @Body() requestDto: CreatePatientDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const patient = await this.hospitalService.createPatient(
      requestDto,
      req.user.hospitalId,
    );
    const result = {
      message: 'success',
      patient: patient,
    };
    return res.status(HttpStatus.CREATED).json(result);
  }

  @Get('main')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: '병원 메인 페이지',
    description: '병원 메인 페이지',
  })
  @ApiOkResponse({
    description: 'success',
    type: HospitalMainResponse,
  })
  async getMainData(@Req() req: Request, @Res() res: Response) {
    const { posts, reservations } = await this.hospitalService.getMainData(
      req.user.hospitalId,
    );
    const result = {
      message: 'success',
      today_posts: posts,
      today_reservations: reservations,
    };
    return res.status(HttpStatus.OK).json(result);
  }

  @Get('patient')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: '병원 환우 관리 페이지',
    description: '병원 환우 관리 페이지',
  })
  @ApiOkResponse({
    description: 'success',
    type: PatientListResponse,
  })
  async getPatients(@Req() req: Request, @Res() res: Response) {
    const patients = await this.hospitalService.getPatients(
      req.user.hospitalId,
    );
    const result = {
      message: 'success',
      patients: patients,
    };
    return res.status(HttpStatus.OK).json(result);
  }

  @Put('changeReservationState')
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
    const reservation = await this.hospitalService.changeReservationState(
      req.user.hospitalId,
      requestDto,
    );
    const result = {
      message: 'success',
      result: reservation,
    };
    return res.status(HttpStatus.OK).json(result);
  }

  @Get('wardList')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: '병동 리스트 API',
    description: '병동 리스트 API',
  })
  @ApiOkResponse({
    description: 'success',
    type: WardListResponse,
  })
  async getWardList(@Req() req: Request, @Res() res: Response) {
    const wards = await this.hospitalService.getWardList(req.user.hospitalId);
    const result = {
      message: 'success',
      wards: wards,
    };
    return res.status(HttpStatus.OK).json(result);
  }

  @Get('roomList')
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
    const rooms = await this.hospitalService.getRoomList(req.user.hospitalId);
    const result = {
      message: 'success',
      rooms: rooms,
    };
    return res.status(HttpStatus.OK).json(result);
  }

  @Get('reservationList')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: '면회 리스트 확인 API',
    description: '면회 리스트 확인 API',
  })
  @ApiOkResponse({
    description: 'success',
    type: ReservationListResponse,
  })
  async getReservationList(
    @Query() query: ReservationQueryDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const reservations = await this.hospitalService.getReservationList(
      req.user.hospitalId,
      query.reservationDate,
    );
    const result = {
      message: 'success',
      reservations: reservations,
    };
    return res.status(HttpStatus.OK).json(result);
  }

  @Put('room')
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
    const room = await this.hospitalService.updateRoom(
      req.user.hospitalId,
      requestDto,
    );
    const result = {
      message: 'success',
      room: room,
    };
    return res.status(HttpStatus.OK).json(result);
  }

  @Put('patient')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: '환자 수정',
    description: '환자 수정',
  })
  @ApiOkResponse({
    status: HttpStatus.OK,
    description: 'success',
    type: UpdatePatientResponse,
  })
  async updatePatient(
    @Body() requestDto: UpdatePatientDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const patient = await this.hospitalService.updatePatient(
      requestDto,
      req.user.hospitalId,
    );
    const result = {
      message: 'success',
      patient: patient,
    };
    return res.status(HttpStatus.OK).json(result);
  }

  @Delete('room')
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
    const deleteResult = await this.hospitalService.deleteRoom(
      req.user.hospitalId,
      requestDto,
    );

    return res.status(HttpStatus.OK).json({ message: deleteResult });
  }

  @Delete('patient')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: '환자 삭제',
    description: '환자 삭제',
  })
  @ApiOkResponse({
    status: HttpStatus.OK,
    description: 'success',
    type: BaseResponse,
  })
  async deletePatietn(
    @Body() requestDto: DeletePatientDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const result = await this.hospitalService.deletePatient(
      requestDto,
      req.user.hospitalId,
    );

    return res.status(HttpStatus.OK).json({ message: result });
  }

  @Get('allReservation')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: '면회 리스트 확인 API',
    description: '면회 리스트 확인 API',
  })
  @ApiOkResponse({
    description: 'success',
    type: AllReservationResponse,
  })
  async getAllReservation(@Req() req: Request, @Res() res: Response) {
    const reservations = await this.hospitalService.getAllReservation(
      req.user.hospitalId,
    );
    const result = {
      message: 'success',
      reservations: reservations,
    };
    return res.status(HttpStatus.OK).json(result);
  }
}
