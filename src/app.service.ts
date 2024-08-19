import { Injectable } from '@nestjs/common';
import { I18nContext, I18nService } from 'nestjs-i18n';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class AppService {
  constructor(
    private readonly http: HttpService,
    private readonly i18n: I18nService,
  ) {}

  // =============================== test code del ===============================

  async i18nResp(): Promise<string> {
    return this.i18n.t('test.HELLO', { lang: I18nContext.current().lang });
  }

}
