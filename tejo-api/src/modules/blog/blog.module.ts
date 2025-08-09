import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { BlogService } from './blog.service';
import { BlogController } from './blog.controller';
import { PrismaService } from '../../prisma.service';
import { AdminGuard } from '../../common/admin.guard';

@Module({
  imports: [JwtModule.register({})],
  providers: [BlogService, PrismaService, AdminGuard],
  controllers: [BlogController],
})
export class BlogModule {}


