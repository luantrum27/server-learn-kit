import { Controller, Post, Body, HttpStatus, HttpCode } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserLoginDto } from './dto/user-login.dto';
import { UserRegisterDto } from 'src/auth/dto/user-register.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { LogoutDto } from './dto/logout.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async login(@Body() user: UserLoginDto) {
    return this.authService.login(user);
  }

  @Post('refresh-token')
  @HttpCode(HttpStatus.CREATED)
  async getRefreshToken(@Body() refreshToken: RefreshTokenDto) {
    try {
      const token = await this.authService.refreshToken(refreshToken);
      return token;
    } catch (error) {
      console.log(error);
    }
  }

  @Post('register')
  register(@Body() userRegister: UserRegisterDto) {
    return this.authService.register(userRegister);
  }

  @Post('logout')
  logout(@Body() dto: LogoutDto) {
    return this.authService.logout(dto);
  }
}
