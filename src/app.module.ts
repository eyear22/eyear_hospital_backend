import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Hospital } from './hospital/entities/hospital.entity';
import { Patient } from './patient/entities/patient.entity';
import { Room } from './room/entities/room.entity';
import { Ward } from './ward/entities/ward.entity';
import { Post } from './post/entities/post.entity';
import { User } from './user/entities/user.entity';
import { HospitalModule } from './hospital/hospital.module';
import { AuthModule } from './auth/auth.module';
import { PostModule } from './post/post.module';
import { ReservationModule } from './reservation/reservation.module';
import { Reservation } from './reservation/entities/reservation.entity';
import { Keyword } from './keywords/entities/keyworrd.entity';
import { NameWord } from './keywords/entities/nameWord.entity';
import { WardModule } from './ward/ward.module';
import { RoomModule } from './room/room.module';
import { PatientModule } from './patient/patient.module';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory() {
        return {
          type: 'mysql',
          host: process.env.MYSQLDB_HOST,
          port: parseInt(process.env.MYSQLDB_DOCKER_PORT, 10),
          username: process.env.MYSQLDB_USER,
          password: process.env.MYSQLDB_PASSWORD,
          database: process.env.MYSQLDB_DATABASE,
          entities: [
            User,
            Post,
            Room,
            Ward,
            Patient,
            Hospital,
            Reservation,
            Keyword,
            NameWord,
          ],
          synchronize: true, // Fix me : set this value to false when deploy
          timezone: 'z',
          charset: 'utf8mb4',
        };
      },
    }),
    ConfigModule.forRoot(),
    HospitalModule,
    AuthModule,
    PostModule,
    ReservationModule,
    WardModule,
    RoomModule,
    PatientModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
