import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { AdminGuard } from '../../common/admin.guard';

@Controller('variants')
export class VariantsController {
  constructor(private prisma: PrismaService) {}

  @Get(':productId')
  list(@Param('productId') productId: string) {
    return this.prisma.productVariant.findMany({ where: { productId } });
  }

  @Post(':productId')
  @UseGuards(AdminGuard)
  create(@Param('productId') productId: string, @Body() body: any) {
    return this.prisma.productVariant.create({ data: { ...body, productId } });
  }

  @Put(':id')
  @UseGuards(AdminGuard)
  update(@Param('id') id: string, @Body() body: any) {
    return this.prisma.productVariant.update({ where: { id }, data: body });
  }

  @Delete(':id')
  @UseGuards(AdminGuard)
  remove(@Param('id') id: string) {
    return this.prisma.productVariant.delete({ where: { id } });
  }
}


