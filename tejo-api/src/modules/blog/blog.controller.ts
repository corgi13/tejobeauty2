import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { BlogService } from './blog.service';
import { AdminGuard } from '../../common/admin.guard';
import axios from 'axios';

@Controller('blog')
export class BlogController {
  constructor(private blog: BlogService) {}

  @Get()
  list(@Query('skip') skip = '0', @Query('take') take = '20') {
    return this.blog.list(Number(skip), Number(take));
  }

  @Get(':slug')
  get(@Param('slug') slug: string) {
    return this.blog.getBySlug(slug);
  }

  @Post()
  @UseGuards(AdminGuard)
  create(@Body() body: any) {
    return this.blog.create(body).then(async (p) => {
      await axios.post(`${process.env.FRONTEND_ORIGIN || 'http://localhost:3000'}/api/revalidate`, { tag: 'blog' }, { headers: { 'X-Revalidate-Secret': process.env.REVALIDATE_SECRET } }).catch(() => undefined);
      return p;
    });
  }

  @Put(':id')
  @UseGuards(AdminGuard)
  update(@Param('id') id: string, @Body() body: any) {
    return this.blog.update(id, body).then(async (p) => {
      await axios.post(`${process.env.FRONTEND_ORIGIN || 'http://localhost:3000'}/api/revalidate`, { tag: 'blog' }, { headers: { 'X-Revalidate-Secret': process.env.REVALIDATE_SECRET } }).catch(() => undefined);
      return p;
    });
  }

  @Delete(':id')
  @UseGuards(AdminGuard)
  remove(@Param('id') id: string) {
    return this.blog.remove(id).then(async (p) => {
      await axios.post(`${process.env.FRONTEND_ORIGIN || 'http://localhost:3000'}/api/revalidate`, { tag: 'blog' }, { headers: { 'X-Revalidate-Secret': process.env.REVALIDATE_SECRET } }).catch(() => undefined);
      return p;
    });
  }
}


