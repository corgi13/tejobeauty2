import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';

@Injectable()
export class BlogService {
  constructor(private prisma: PrismaService) {}

  list(skip = 0, take = 20) {
    return this.prisma.blogPost.findMany({ skip, take, orderBy: { createdAt: 'desc' } });
  }

  getBySlug(slug: string) {
    return this.prisma.blogPost.findUnique({ where: { slug } });
  }

  create(data: any) {
    return this.prisma.blogPost.create({ data });
  }

  update(id: string, data: any) {
    return this.prisma.blogPost.update({ where: { id }, data });
  }

  remove(id: string) {
    return this.prisma.blogPost.delete({ where: { id } });
  }
}


