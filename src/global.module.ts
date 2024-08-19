import { Module, Global } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios';

const httpModule = HttpModule.register({
  timeout: 20000,
  maxRedirects: 10,
});

const typeOrmModule = TypeOrmModule.forFeature([
  // Your Table Entity
]);

@Global()
@Module({
  imports: [typeOrmModule, httpModule],
  exports: [TypeOrmModule, httpModule],
})
export class GlobalModule {}
