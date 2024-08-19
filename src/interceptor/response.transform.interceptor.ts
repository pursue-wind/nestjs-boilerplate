// src/interception/transform.interception.ts
import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { R } from '../common/r';
import { I18nContext } from 'nestjs-i18n';

@Injectable()
export class TransformInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        if (data instanceof R) {
          const msg = data.msg;
          const i18n = I18nContext.current();
          const lang = i18n.lang;
          const transMsg: string = i18n.t('r.' + msg, { lang });
          return data.resetMsg(transMsg);
        }

        return data;
      }),
    );
  }
}
