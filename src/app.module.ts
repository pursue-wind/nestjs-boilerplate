import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AcceptLanguageResolver, I18nModule } from 'nestjs-i18n';
import * as path from 'node:path';
import { AppConfigModule } from './config/config.module';
import { AuthModule } from './modules/auth/auth.module';
import { ApiConfigService } from './config/api-config.service';
import { GlobalModule } from './global.module';

const i18nModule = I18nModule.forRoot({
  fallbackLanguage: 'en',
  loaderOptions: {
    path: path.join(__dirname, './i18n/'),
    watch: true,
  },
  resolvers: [AcceptLanguageResolver],
});

const cfgModule = ConfigModule.forRoot({
  isGlobal: true,
  envFilePath: '.env',
});

@Module({
  imports: [
    cfgModule,
    AppConfigModule,
    i18nModule,
    AuthModule,
    ConfigModule.forRoot({ isGlobal: true }),
    GlobalModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ApiConfigService) =>
        configService.postgresConfig,
      inject: [ApiConfigService],
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
