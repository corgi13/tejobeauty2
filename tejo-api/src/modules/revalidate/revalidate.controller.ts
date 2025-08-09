import { Body, Controller, Post } from '@nestjs/common';
import axios from 'axios';

@Controller('revalidate')
export class RevalidateController {
  @Post()
  async revalidate(@Body() body: { tag?: string }) {
    const secret = process.env.REVALIDATE_SECRET;
    const web = process.env.FRONTEND_ORIGIN || 'http://localhost:3000';
    await axios.post(`${web}/api/revalidate`, body, { headers: { 'X-Revalidate-Secret': secret } });
    return { ok: true };
  }
}


