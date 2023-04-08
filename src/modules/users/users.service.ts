import { Injectable } from '@nestjs/common';
import { NotFoundException } from 'src/exceptions/not-found.exception';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async findOne(username: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        username,
      },
    });
    if (!user) throw new NotFoundException('user');
    return user;
  }

  async getUserProfile(id: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        id,
      },
    });
    if (!user) throw new NotFoundException('user');
    return user;
  }
}
