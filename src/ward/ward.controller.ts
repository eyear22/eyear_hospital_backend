import {
  Body,
  Controller,
  Delete,
  HttpStatus,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { DeleteWardDto } from 'src/hospital/dto/request-dto/delete-ward.dto';
import { BaseResponse } from 'src/util/swagger/base-response.dto';
import { Request, Response } from 'express';
import { WardService } from './ward.service';

@Controller('')
export class WardController {
  constructor(private readonly wardService: WardService) {}

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
}
