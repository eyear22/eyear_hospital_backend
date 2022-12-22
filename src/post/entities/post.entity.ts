import { Hospital } from '../../hospital/entities/hospital.entity';
import { Patient } from '../../patient/entities/patient.entity';
import { User } from '../../user/entities/user.entity';
import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Common } from '../../entities/common.entity';

@Entity()
export class Post extends Common {
  @Column({ type: 'varchar' })
  video: string;

  @Column({ type: 'varchar' })
  text: string;

  @Column({ default: false })
  check: boolean;

  @Column({ type: 'int' })
  stampNumber: number;

  @Column({ type: 'int' })
  cardNumber: number;

  @ManyToOne(() => Hospital, (hospital) => hospital.posts, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  hospital: Hospital;

  @ManyToOne(() => User, (user) => user.posts, { onDelete: 'CASCADE' })
  @JoinColumn()
  user: User;

  @ManyToOne(() => Patient, (patient) => patient.posts, { onDelete: 'CASCADE' })
  @JoinColumn()
  patient: Patient;
}
