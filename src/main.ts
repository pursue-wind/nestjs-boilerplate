import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './exception/business.exception.filters';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { I18nValidationPipe } from 'nestjs-i18n';
import { MyI18nValidationExceptionFilter } from './exception/i18n.execption.filters';
import { BaseExceptionsFilter } from './exception/base.execption.filters';
import { TransformInterceptor } from './interceptor/response.transform.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // 全局异常处理
  app.useGlobalFilters(new BaseExceptionsFilter());
  app.useGlobalFilters(new HttpExceptionFilter());
  // R 返回 msg 国际化
  app.useGlobalInterceptors(new TransformInterceptor());

  // 使用支持国际化的校验器
  app.useGlobalPipes(new I18nValidationPipe());
  app.useGlobalFilters(new MyI18nValidationExceptionFilter());

  // swagger
  const apiOptions = new DocumentBuilder()
    .setTitle('xxx server')
    .setDescription('APIs descriptions')
    .setVersion('v0.1')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, apiOptions);
  SwaggerModule.setup('api', app, document);

  await app.listen(3000);
}

bootstrap();
