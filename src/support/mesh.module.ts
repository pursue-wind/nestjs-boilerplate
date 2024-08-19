import { Module } from '@nestjs/common';
import { GraphqlController } from './mesh.controller';

@Module({
  controllers: [GraphqlController],
})
export class GraphqlModule {}
