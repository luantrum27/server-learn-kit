import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/modules/users/users.service';
import { UserLoginDto } from './dto/user-login.dto';
import * as argon from 'argon2';
import { ConfigService } from '@nestjs/config';
import { UserRegisterDto } from 'src/auth/dto/user-register.dto';
import { uuid } from 'uuidv4';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private usersService: UsersService,
    private jwtService: JwtService,
    private config: ConfigService,
  ) {}
  async login(data: UserLoginDto) {
    const user = await this.usersService.findOne(data.username);

    if (!user) throw new UnauthorizedException();
    const passwordMatches = await argon.verify(user.password, data.password);
    if (!passwordMatches) throw new UnauthorizedException();

    return this.signToken(user.username, user.id);
  }

  async register(userRegister: UserRegisterDto) {
    const hashedPassword = await argon.hash(userRegister.password);
    const newUser = {
      id: uuid(),
      ...userRegister,
      password: hashedPassword,
    };
    console.log(newUser);

    const result = await this.prisma.user.create({ data: newUser });
    delete result.password;
    return result;
  }

  async signToken(username: string, userId: string) {
    const payload = { username: username, sub: userId };
    const secret = this.config.get('JWT_SECRET');
    const token = await this.jwtService.signAsync(payload, {
      secret,
      expiresIn: '15m',
    });

    return {
      access_token: token,
    };
  }
}
