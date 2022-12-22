import { Common } from '../../entities/common.entity';
import { Entity, Column, ManyToOne, OneToMany } from 'typeorm';
import { Hospital } from '../../hospital/entities/hospital.entity';
import { Patient } from '../../hospital/entities/patient.entity';
import { Room } from '../../hospital/entities/room.entity';

@Entity()
export class Ward extends Common {
  @Column({ type: 'varchar', length: 50 })
  name: string;

  @ManyToOne(() => Hospital, (hospital) => hospital.wards, {
    onDelete: 'CASCADE',
  })
  hospital: Hospital;

  @OneToMany(() => Room, (room) => room.ward)
  rooms: Room[];

  @OneToMany(() => Patient, (patient) => patient.ward)
  patients: Patient[];
}
