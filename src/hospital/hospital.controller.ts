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
import { Request, Response } from 'express';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CreateHospitalDto } from './dto/create-hospital.dto';
import { CreatePatientDto } from './dto/create-patient.dto';
import { CreateRoomDto } from './dto/create-room.dto';
import { CreateWardDto } from './dto/create-ward.dto';
import { IdCheckDto } from './dto/id-check.dto';
import { HospitalService } from './hospital.service';

@Controller('hospital')
export class HospitalController {
  constructor(private readonly hospitalService: HospitalService) {}

  @Post('')
  async create(@Body() requestDto: CreateHospitalDto, @Res() res: Response) {
    const hospital = await this.hospitalService.create(requestDto);
    return res.status(HttpStatus.CREATED).json(hospital);
  }

  @Get('idCheck')
  async idCheck(@Query() requestDto: IdCheckDto, @Res() res: Response) {
    const result = await this.hospitalService.idCheck(requestDto);
    return res.status(HttpStatus.OK).json(result);
  }

  @Post('ward')
  @UseGuards(JwtAuthGuard)
  async createWard(
    @Body() requestDto: CreateWardDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const ward = await this.hospitalService.createWard(
      requestDto,
      req.user.hospitalId,
    );
    return res.status(HttpStatus.CREATED).json(ward);
  }

  @Post('room')
  @UseGuards(JwtAuthGuard)
  async createRoom(
    @Body() requestDto: CreateRoomDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const room = await this.hospitalService.createRoom(
      requestDto,
      req.user.hospitalId,
    );
    return res.status(HttpStatus.CREATED).json(room);
  }

  @Post('patient')
  @UseGuards(JwtAuthGuard)
  async createPatient(
    @Body() requestDto: CreatePatientDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const patient = await this.hospitalService.createPatient(
      requestDto,
      req.user.hospitalId,
    );
    return res.status(HttpStatus.CREATED).json(patient);
  }

  @Get('main')
  @UseGuards(JwtAuthGuard)
  async getMainData(@Req() req: Request) {
    return await this.hospitalService.getMainData(req.user.hospitalId);
  }
}
