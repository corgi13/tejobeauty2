import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  findByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }

  create(data: { firstName?: string; lastName?: string; email: string; password: string; isAdmin?: boolean }) {
    return this.prisma.user.create({ data });
  }

  findById(id: string) {
    return this.prisma.user.findUnique({ where: { id } });
  }
}


