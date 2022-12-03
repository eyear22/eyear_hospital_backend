import { ForbiddenException, HttpStatus, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LoginHospitalDto } from './dto/login-hospital.dto';
import { Hospital } from 'src/hospital/entities/hospital.entity';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Hospital)
    private hospitalRepository: Repository<Hospital>,
    private jwtService: JwtService,
  ) {}

  async validateHospital(requestDto: LoginHospitalDto): Promise<any> {
    const { hospitalId, password } = requestDto;

    const hos = await this.hospitalRepository.findOneBy({ hospitalId });

    if (!hos) {
      throw new ForbiddenException({
        statusCode: HttpStatus.FORBIDDEN,
        message: ['Unregistered hospital'],
        error: 'Forbidden',
      });
    }
    const isMatch = await bcrypt.compare(password, hos.password);

    if (isMatch) {
      const { password, ...result } = hos;
      return result;
    } else {
      throw new ForbiddenException({
        statusCode: HttpStatus.FORBIDDEN,
        message: ['Wrong password'],
        error: 'Forbidden',
      });
    }
  }

  async login(hospital: any) {
    const tokens = await this.getTokens(hospital.id, hospital.hospitalId);
    const data = {
      tokens: tokens,
      user: {
        name: hospital.name,
      },
    };
    await this.updateRtHash(hospital.id, tokens.refresh_token);
    return data;
  }

  async updateRtHash(id: number, refresh_token: string) {
    const hash = await this.hashData(refresh_token);
    await this.hospitalRepository.update(
      { id },
      { currentHashedRefreshToken: hash },
    );
  }

  async refreshTokens(hospital: any) {
    const isExist = await this.hospitalRepository.findOneBy({
      id: hospital.id,
    });
    if (!isExist || !isExist.currentHashedRefreshToken)
      throw new ForbiddenException('Invalid credentials');
    const rtMatches = bcrypt.compare(
      hospital.refresh_token,
      isExist.currentHashedRefreshToken,
    );
    if (!rtMatches) throw new ForbiddenException('Invalid credentials');
    const tokens = await this.getTokens(hospital.id, hospital.hospitalId);
    await this.updateRtHash(hospital.id, tokens.refresh_token);
    return tokens;
  }

  hashData(data: string) {
    return bcrypt.hash(data, 10);
  }

  async getTokens(id: number, hospitalId: string) {
    const [access_token, refresh_token] = await Promise.all([
      this.jwtService.signAsync(
        { id, hospitalId },
        {
          expiresIn: parseInt(process.env.JWT_ACCESS_TOKEN_EXPIRATION_TIME),
          secret: process.env.JWT_ACCESS_TOKEN_SECRET,
        },
      ),
      this.jwtService.signAsync(
        { id, hospitalId },
        {
          expiresIn: parseInt(process.env.JWT_REFRESH_TOKEN_EXPIRATION_TIME),
          secret: process.env.JWT_REFRESH_TOKEN_SECRET,
        },
      ),
    ]);

    return {
      access_token,
      refresh_token,
    };
  }
}
