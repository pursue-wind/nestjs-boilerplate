import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  ServiceUnavailableException,
  HttpStatus,
  NotFoundException,
} from '@nestjs/common';
import { R } from '../common/r';

@Catch(Error)
export class BaseExceptionsFilter implements ExceptionFilter {
  catch(exception: Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    console.log(exception);
    if (exception instanceof NotFoundException) {
      response
        .status(exception.getStatus())
        .send(R.error(exception.getStatus(), 'Not Found'));
      return;
    }
    const exResponse = new ServiceUnavailableException().getResponse();
    if (typeof exResponse === 'string') {
      response.status(HttpStatus.SERVICE_UNAVAILABLE).send({
        code: HttpStatus.SERVICE_UNAVAILABLE,
        path: request.url,
        msg: new ServiceUnavailableException().getResponse(),
      });
    } else {
      response.status(HttpStatus.SERVICE_UNAVAILABLE).send({
        code: HttpStatus.SERVICE_UNAVAILABLE,
        path: request.url,
        ...(new ServiceUnavailableException().getResponse() as any),
      });
    }
  }
}
