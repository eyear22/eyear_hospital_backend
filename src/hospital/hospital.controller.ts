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
}
