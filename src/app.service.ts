import { Injectable } from '@nestjs/common';
import { I18nContext, I18nService } from 'nestjs-i18n';
import { execute } from './support/graph.mesh.endpoint';
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

  async execGraphMeshFunc(): Promise<string> {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return await execute(
      'http://127.0.0.1:8000/subgraphs/name/fusion',
      `
    query MyQuery {
      eventCounters(first: 10) {
        count
        id
      }
    }
    `,
    );
  }

  async pong(): Promise<string> {
    return 'pong';
  }
}
