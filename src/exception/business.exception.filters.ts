import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { I18nContext, I18nValidationException } from 'nestjs-i18n';
import { R } from '../common/r';
import { BusinessException } from './business.exceptions';

@Catch(BusinessException)
export class HttpExceptionFilter implements ExceptionFilter {
  async catch(exception: HttpException, host: ArgumentsHost) {
    if (exception instanceof I18nValidationException) {
      return;
    }
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const status = exception.getStatus();
    const i18nContext = I18nContext.current();
    const lang = i18nContext.lang;
    const i18nMsg: string = i18nContext.t('error_code.' + exception.message, {
      lang,
    });

    response.status(502).json(R.error(status, i18nMsg));
  }
}
