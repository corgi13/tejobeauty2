import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  list(skip = 0, take = 20) {
    return this.prisma.product.findMany({ skip, take, orderBy: { createdAt: 'desc' } });
  }

  getBySlug(slug: string) {
    return this.prisma.product.findUnique({ where: { slug } });
  }

  create(data: any) {
    return this.prisma.product.create({ data });
  }

  update(id: string, data: any) {
    return this.prisma.product.update({ where: { id }, data });
  }

  remove(id: string) {
    return this.prisma.product.delete({ where: { id } });
  }
}


