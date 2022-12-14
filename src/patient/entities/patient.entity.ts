import { Post } from '../../post/entities/post.entity';
import { Entity, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { Hospital } from '../../hospital/entities/hospital.entity';
import { Room } from '../../room/entities/room.entity';
import { Ward } from '../../ward/entities/ward.entity';
import { Common } from '../../entities/common.entity';
import { Reservation } from '../../reservation/entities/reservation.entity';
import { Keyword } from '../../keywords/entities/keyworrd.entity';

@Entity()
export class Patient extends Common {
  @Column({ type: 'varchar', length: 50 })
  name: string;

  @Column({ type: 'varchar', length: 50 })
  patNumber: string;

  @Column()
  birth: Date;

  @Column()
  inDate: Date;

  @Column({ type: 'varchar' })
  infoNumber: string;

  @ManyToOne(() => Hospital, (hospital) => hospital.patients, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  hospital: Hospital;

  @ManyToOne(() => Ward, (ward) => ward.patients, { onDelete: 'CASCADE' })
  @JoinColumn()
  ward: Ward;

  @ManyToOne(() => Room, (room) => room.patients, { onDelete: 'CASCADE' })
  @JoinColumn()
  room: Room;

  @OneToMany(() => Post, (post) => post.patient)
  posts: Post[];

  @OneToMany(() => Reservation, (reservation) => reservation.patient)
  reservations: Reservation[];

  @OneToMany(() => Keyword, (keyword) => keyword.patient)
  keywords: Keyword[];
}
