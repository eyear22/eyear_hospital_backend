import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { LoginHospitalDto } from '../dto/login-hospital.dto';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'local') {
  constructor(private authService: AuthService) {
    super({
      usernameField: 'hospitalId',
    });
  }

  async validate(hospitalId: string, password: string): Promise<any> {
    const authDto: LoginHospitalDto = {
      hospitalId: hospitalId,
      password: password,
    };

    const hospital = await this.authService.validateHospital(authDto);
    if (!hospital) {
      throw new UnauthorizedException();
    }
    return hospital;
  }
}
