import { Post } from '../../post/entities/post.entity';
import { Entity, Column, OneToMany } from 'typeorm';
import { Patient } from '../../patient/entities/patient.entity';
import { Ward } from '../../ward/entities/ward.entity';
import { Common } from '../../entities/common.entity';
import { Exclude } from 'class-transformer';
import { Reservation } from '../../reservation/entities/reservation.entity';
import { User } from '../../user/entities/user.entity';
import { Room } from 'src/room/entities/room.entity';

@Entity()
export class Hospital extends Common {
  @Column({ type: 'varchar', length: 50 })
  name: string;

  @Column({ type: 'varchar', length: 50, unique: true })
  hospitalId: string;

  @Column({ type: 'varchar' })
  password: string;

  @Column({ type: 'varchar', length: 50, unique: true })
  phoneNumber: string;

  @Column({ type: 'varchar' })
  address: string;

  @Column({ nullable: true })
  @Exclude()
  currentHashedRefreshToken?: string;

  @OneToMany(() => Ward, (ward) => ward.hospital)
  wards: Ward[];

  @OneToMany(() => Patient, (patient) => patient.hospital)
  patients: Patient[];

  @OneToMany(() => Post, (post) => post.hospital)
  posts: Post[];

  @OneToMany(() => Reservation, (reservation) => reservation.hospital)
  reservations: Reservation[];

  @OneToMany(() => User, (user) => user.hospital)
  users: User[];

  @OneToMany(() => Room, (room) => room.hospital)
  rooms: Room[];
}
