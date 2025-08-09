import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { MeiliSearch } from 'meilisearch';

@Controller('search')
export class SearchController {
  @Get()
  async search(@Query('q') q: string, @Query('index') index = 'products') {
    const client = new MeiliSearch({ host: process.env.MEILI_URL!, apiKey: process.env.MEILI_MASTER_KEY });
    const idx = client.index(index);
    const res = await idx.search(q || '', { limit: 10 });
    return res.hits;
  }

  @Get('typeahead')
  async typeahead(@Query('q') q: string) {
    const client = new MeiliSearch({ host: process.env.MEILI_URL!, apiKey: process.env.MEILI_MASTER_KEY });
    const res = await client.index('products').search(q || '', { limit: 5, attributesToRetrieve: ['id','slug','name'] });
    return res.hits.map((h: any) => ({ id: h.id, slug: h.slug, name: h.name }));
  }

  @Post('synonyms')
  async synonyms(@Body() body: Record<string, string[]>) {
    const client = new MeiliSearch({ host: process.env.MEILI_URL!, apiKey: process.env.MEILI_MASTER_KEY });
    await client.index('products').updateSettings({ synonyms: body });
    return { ok: true };
  }
}


