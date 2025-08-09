import { Module } from '@nestjs/common';
import { ReindexController } from './reindex.controller';

@Module({ controllers: [ReindexController] })
export class ReindexModule {}


