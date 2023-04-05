import { Module } from '@nestjs/common';
import { GoogleService } from './google.service';
import { GoogleController } from './google.controller';
import { GoogleStrategy } from '../strategy/google.strategy';

@Module({
  providers: [GoogleService, GoogleStrategy],
  controllers: [GoogleController],
  exports: [GoogleService],
})
export class GoogleModule {}
