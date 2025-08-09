import { Controller, Get, Query } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import { createHash } from 'crypto';

@Controller('uploads')
export class UploadsController {
  @Get('sign')
  sign(@Query('folder') folder = 'tejo') {
    const timestamp = Math.round(Date.now() / 1000);
    const paramsToSign = `folder=${folder}&timestamp=${timestamp}`;
    const signature = createHash('sha1')
      .update(paramsToSign + process.env.CLOUDINARY_API_SECRET)
      .digest('hex');
    return {
      cloudName: process.env.CLOUDINARY_CLOUD_NAME,
      apiKey: process.env.CLOUDINARY_API_KEY,
      timestamp,
      folder,
      signature,
    };
  }
}


