import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/modules/users/users.service';
import { UserLoginDto } from './dto/user-login.dto';
import * as argon from 'argon2';
import { ConfigService } from '@nestjs/config';
import { UserRegisterDto } from 'src/auth/dto/user-register.dto';
import { uuid } from 'uuidv4';
import { PrismaService } from 'src/prisma/prisma.service';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { IAuthentication } from 'src/interfaces/auth.interface';
import { User } from '@prisma/client';
import { LogoutDto } from './dto/logout.dto';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class AuthService {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
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
    const token = await this.signToken(user);
    const refreshToken = await this.createRefreshToken(user);
    await this.cacheManager.set(this.getRefreshTokenKey(user.id), refreshToken);
    return { access_token: token, refresh_token: refreshToken };
  }

  async register(userRegister: UserRegisterDto) {
    const hashedPassword = await argon.hash(userRegister.password);
    const newUser = {
      id: uuid(),
      ...userRegister,
      password: hashedPassword,
    } as User;
    const token = await this.signToken(newUser);
    const refreshToken = await this.createRefreshToken(newUser);
    await this.cacheManager.set(
      this.getRefreshTokenKey(newUser.id),
      refreshToken,
    );
    await this.prisma.user.create({ data: newUser });
    return { access_token: token, refresh_token: refreshToken };
  }

  async signToken(user: User) {
    const payload = { username: user.username, userId: user.id };
    const secret = this.config.get('JWT_SECRET');
    const token = await this.jwtService.signAsync(payload, {
      secret,
      expiresIn: '15m',
    });

    return token;
  }
  async createRefreshToken(user: User) {
    const payload = { username: user.username, userId: user.id };
    const secret = this.config.get('JWT_SECRET');
    const token = await this.jwtService.signAsync(payload, {
      secret,
      expiresIn: 900000 * 3,
    });

    return token;
  }

  async refreshToken(dto: RefreshTokenDto) {
    const payload = <IAuthentication>this.jwtService.verify(dto.refreshToken, {
      secret: this.config.get('JWT_SECRET'),
    });

    const user = await this.prisma.user.findUnique({
      where: {
        id: payload.userId,
      },
    });
    const token = await this.signToken(user);

    if (payload.exp > 900000) {
      return {
        access_token: token,
        refresh_token: dto.refreshToken,
      };
    }
    const refreshToken = await this.createRefreshToken(user);
    await this.cacheManager.set(this.getRefreshTokenKey(user.id), refreshToken);
    return {
      access_token: token,
      refresh_token: refreshToken,
    };
  }

  async logout(dto: LogoutDto) {
    const payload = <IAuthentication>this.jwtService.verify(dto.refreshToken, {
      secret: this.config.get('JWT_SECRET'),
    });
    const user = await this.prisma.user.findUnique({
      where: {
        id: payload.userId,
      },
    });
    const savedToken = await this.cacheManager.get(
      this.getRefreshTokenKey(user.id),
    );
    if (savedToken !== dto.refreshToken) {
      throw new UnauthorizedException();
    }
    await this.cacheManager.del(this.getRefreshTokenKey(user.id));
    return;
  }
  getRefreshTokenKey = (name: string) => {
    return 'refresh-token-' + name;
  };
}
