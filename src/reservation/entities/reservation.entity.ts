import { Hospital } from '../../hospital/entities/hospital.entity';
import { Patient } from '../../hospital/entities/patient.entity';
import { User } from '../../user/entities/user.entity';
import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Common } from '../../entities/common.entity';

@Entity()
export class Reservation extends Common {
  @Column({ type: Date })
  reservationDate: Date;

  @Column({ type: 'int' })
  timetableIndex: number;

  @Column({ type: 'boolean' })
  faceToface: boolean;

  @Column({ type: 'int', default: 0 })
  approveCheck: number;

  @ManyToOne(() => Hospital, (hospital) => hospital.reservations, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  hospital: Hospital;

  @ManyToOne(() => User, (user) => user.reservations, { onDelete: 'CASCADE' })
  user: User;

  @ManyToOne(() => Patient, (patient) => patient.reservations, {
    onDelete: 'CASCADE',
  })
  patient: Patient;
}
