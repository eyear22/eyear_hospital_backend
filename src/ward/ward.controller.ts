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
import { DeleteWardDto } from 'src/ward/dto/request-dto/delete-ward.dto';
import { BaseResponse } from 'src/util/swagger/base-response.dto';
import { Request, Response } from 'express';
import { WardService } from './ward.service';
import { CreateWardResponse } from 'src/ward/dto/response-dto/create-ward-response.dto';
import { CreateWardDto } from 'src/ward/dto/request-dto/create-ward.dto';
import { UpdateWardResponse } from 'src/ward/dto/response-dto/update-ward-response.dto';
import { UpdateWardDto } from 'src/ward/dto/request-dto/update-ward.dto';
import { WardListResponse } from './dto/response-dto/ward-list-response.dto';

@Controller('')
export class WardController {
  constructor(private readonly wardService: WardService) {}

  @Post('hospital/ward')
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
    const ward = await this.wardService.createWard(
      requestDto,
      req.user.hospitalId,
    );
    const result = {
      message: 'success',
      ward: ward,
    };
    return res.status(HttpStatus.CREATED).json(result);
  }

  @Put('hospital/ward')
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
    const ward = await this.wardService.updateWard(
      requestDto,
      req.user.hospitalId,
    );
    const result = {
      message: 'success',
      ward: ward,
    };
    return res.status(HttpStatus.OK).json(result);
  }

  @Delete('hospital/ward')
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
    const result = await this.wardService.deleteWard(
      requestDto,
      req.user.hospitalId,
    );
    return res.status(HttpStatus.OK).json({ message: result });
  }

  @Get('hospital/wardList')
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
    const wards = await this.wardService.getWards(req.user.hospitalId);
    const result = {
      message: 'success',
      wards: wards,
    };
    return res.status(HttpStatus.OK).json(result);
  }
}
