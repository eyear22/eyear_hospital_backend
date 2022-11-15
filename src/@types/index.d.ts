import { ReqHospitalDto } from 'src/hospital/dto/req-hospital.dto';

declare global {
  namespace Express {
    // eslint-disable-next-line @typescript-eslint/no-empty-interface
    export interface User extends ReqHospitalDto {}
  }
}
