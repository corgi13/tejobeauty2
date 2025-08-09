import { Controller, Get, Header, Res } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { Response } from 'express';

@Controller('feeds')
export class FeedsController {
  constructor(private prisma: PrismaService) {}

  @Get('gmc.xml')
  @Header('Content-Type', 'application/xml')
  async gmc(@Res() res: Response) {
    const products = await this.prisma.product.findMany({ take: 1000 });
    const items = products
      .map((p) => `\n  <item>\n    <g:id>${p.id}</g:id>\n    <title><![CDATA[${p.name}]]></title>\n    <g:price>${Number(p.price).toFixed(2)} EUR</g:price>\n    <g:brand>${p.brand}</g:brand>\n    <link>${(process.env.FRONTEND_ORIGIN || 'http://localhost:3000')}/en/products/${p.slug}</link>\n  </item>`)
      .join('');
    const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<rss xmlns:g="http://base.google.com/ns/1.0" version="2.0">\n<channel>\n  <title>Tejo-Beauty</title>${items}\n</channel>\n</rss>`;
    res.send(xml);
  }
}


