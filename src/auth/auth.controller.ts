import {
  Controller,
  Get,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { BaseResponse } from 'src/util/swagger/base-response.dto';
import { json } from 'stream/consumers';
import { AuthService } from './auth.service';
import { LoginHospitalDto } from './dto/login-hospital.dto';
import { LoginResponse } from './dto/login-response.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { JwtRefreshAuthGuard } from './guards/jwt-refresh-auth.guard';
import { LocalAuthGuard } from './guards/local-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @ApiBody({ type: LoginHospitalDto })
  @ApiOperation({
    summary: '병원 로그인 API',
    description: 'hospitalId과 password 정보를 통해 로그인을 진행한다',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'success',
    type: LoginResponse,
  })
  async login(@Req() req: Request, @Res() res: Response) {
    const data = await this.authService.login(req.user);
    res.setHeader('Authorization', data.tokens.access_token);

    return res
      .status(HttpStatus.OK)
      .send({ message: 'success', tokens: data.tokens, user: data.user });
  }

  @UseGuards(JwtAuthGuard)
  @Get('/test')
  async getHello(@Req() req) {
    return 'hello';
  }

  @UseGuards(JwtRefreshAuthGuard)
  @Get('/refresh')
  async getToken(@Req() req) {
    return await this.authService.refreshTokens(req.user);
  }
}
