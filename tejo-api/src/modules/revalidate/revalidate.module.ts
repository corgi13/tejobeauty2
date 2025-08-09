import { Module } from '@nestjs/common';
import { RevalidateController } from './revalidate.controller';

@Module({ controllers: [RevalidateController] })
export class RevalidateModule {}


