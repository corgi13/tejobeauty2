import { Body, Controller, Post } from '@nestjs/common';
import { Queue } from 'bullmq';
import IORedis from 'ioredis';

const connection = new IORedis(process.env.REDIS_URL || 'redis://localhost:6379');
const q = new Queue('search-reindex', { connection });

@Controller('reindex')
export class ReindexController {
  @Post()
  async reindex(@Body() body: { types?: string[] }) {
    const types = body.types?.length ? body.types : ['products', 'blog'];
    await Promise.all(types.map((t) => q.add('reindex', { type: t })));
    return { ok: true };
  }
}


