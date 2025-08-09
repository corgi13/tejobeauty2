import { Body, Controller, Get, Post } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';

@Controller('partner-requests')
export class PartnerRequestsController {
  constructor(private prisma: PrismaService) {}

  @Post()
  create(@Body() body: { name: string; company: string; email: string; phone?: string; message: string }) {
    return this.prisma.partnerRequest.create({ data: { ...body } });
  }

  @Get()
  list() {
    return this.prisma.partnerRequest.findMany({ orderBy: { createdAt: 'desc' } });
  }
}


