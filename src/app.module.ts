import { JwtService } from '@nestjs/jwt';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthController } from './auth/auth.controller';
import { AuthModule } from './auth/auth.module';
import { AuthService } from './auth/auth.service';
import { UsersModule } from './modules/users/users.module';
import { PrismaModule } from './prisma/prisma.module';
import { CoursesController } from './modules/courses/courses.controller';
import { CoursesService } from './modules/courses/courses.service';
import { CoursesModule } from './modules/courses/courses.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    UsersModule,
    AuthModule,
    PrismaModule,
    CoursesModule,
  ],
  controllers: [AuthController, CoursesController],
  providers: [AuthService, JwtService, CoursesService],
})
export class AppModule {}
