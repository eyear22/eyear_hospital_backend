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
import { PatientListResponse } from './dto/response-dto/patient-list-response.dto';
import { PatientService } from './patient.service';
import { Request, Response } from 'express';
import { UpdatePatientResponse } from './dto/response-dto/update-patient-response.dto';
import { UpdatePatientDto } from './dto/request-dto/update-patient.dto';
import { DeletePatientDto } from './dto/request-dto/delete-patient.dto';
import { BaseResponse } from 'src/util/swagger/base-response.dto';
import { CreatePatientResponse } from './dto/response-dto/create-patient-response.dto';
import { CreatePatientDto } from './dto/request-dto/create-patient.dto';
@Controller('')
export class PatientController {
  constructor(private readonly patientService: PatientService) {}

  @Post('hospital/patient')
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
    const patient = await this.patientService.createPatient(
      requestDto,
      req.user.hospitalId,
    );
    const result = {
      message: 'success',
      patient: patient,
    };
    return res.status(HttpStatus.CREATED).json(result);
  }

  @Get('hospital/patient')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: '환자 리스트 조회',
    description: '환자 리스트 조회',
  })
  @ApiOkResponse({
    description: 'success',
    type: PatientListResponse,
  })
  async getPatients(@Req() req: Request, @Res() res: Response) {
    const patients = await this.patientService.getPatients(req.user.hospitalId);
    const result = {
      message: 'success',
      patients: patients,
    };
    return res.status(HttpStatus.OK).json(result);
  }

  @Put('hospital/patient')
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
    const patient = await this.patientService.updatePatient(
      requestDto,
      req.user.hospitalId,
    );
    const result = {
      message: 'success',
      patient: patient,
    };
    return res.status(HttpStatus.OK).json(result);
  }

  @Delete('hospital/patient')
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
    const result = await this.patientService.deletePatient(
      requestDto,
      req.user.hospitalId,
    );

    return res.status(HttpStatus.OK).json({ message: result });
  }
}
