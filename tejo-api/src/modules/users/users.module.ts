import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PrismaService } from '../../prisma.service';

@Module({
  imports: [JwtModule.register({})],
  providers: [UsersService, PrismaService],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}


