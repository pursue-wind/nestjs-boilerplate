import { HttpException } from '@nestjs/common';
import { ErrorCode } from '../common/error.code';

/**
 * 自定义业务异常
 */
export class BusinessException extends HttpException {
  constructor(err: ErrorCode) {
    const errCode = err.valueOf();
    super(err.toString(), errCode);
  }
}
