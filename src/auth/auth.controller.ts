import { JwtAuthGuard } from './guards/jwt-auth.guard';
import {
  Controller,
  Post,
  Get,
  Request,
  UseGuards,
  Body,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserLoginDto } from './dto/user-login.dto';
import { UserRegisterDto } from 'src/auth/dto/user-register.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async login(@Body() user: UserLoginDto) {
    return this.authService.login(user);
  }
  @Get('hello')
  hello() {
    console.log('hello');
    return 'hello';
  }

  @Post('register')
  register(@Body() userRegister: UserRegisterDto) {
    return this.authService.register(userRegister);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }
}
