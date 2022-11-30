import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
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
import { BaseResponse } from 'src/util/swagger/base-response.dto';
import { CreateHospitalResponse } from './dto/create-hospital-response.dto';
import { CreateHospitalDto } from './dto/create-hospital.dto';
import { CreatePatientResponse } from './dto/create-patient-response.dto';
import { CreatePatientDto } from './dto/create-patient.dto';
import { CreateRoomResponse } from './dto/create-room-response.dto';
import { CreateRoomDto } from './dto/create-room.dto';
import { CreateWardResponse } from './dto/create-ward-response.dto';
import { CreateWardDto } from './dto/create-ward.dto';
import { HospitalMainResponse } from './dto/hospital-main-response.dto';
import { IdCheckResponse } from './dto/id-check-response.dto';
import { IdCheckDto } from './dto/id-check.dto';
import { HospitalService } from './hospital.service';

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
    const today_posts = await this.hospitalService.getMainData(
      req.user.hospitalId,
    );
    const result = {
      message: 'success',
      today_posts: today_posts,
    };
    return res.status(HttpStatus.OK).json(result);
  }
}
