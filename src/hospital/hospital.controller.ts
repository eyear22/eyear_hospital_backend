import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Query,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { CreateHospitalDto } from './dto/create-hospital.dto';
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
}
