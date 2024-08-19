import * as path from 'node:path';

export class R {
  msg: string;
  path: string;
  timestamp: string;
  code: number;
  errors: any;
  data: any;

  constructor(
    message: string,
    path: string,
    statusCode: number,
    errors: any[],
    data: any,
  ) {
    this.msg = message;
    this.path = path;
    this.timestamp = new Date().toISOString();
    this.code = statusCode;
    this.errors = errors;
    this.data = data;
  }

  static success(data: any) {
    return new R('Success', path.resolve(), 200, [], data);
  }

  static error(statusCode: number, message: string, errors: any = null) {
    return new R(message, path.resolve(), statusCode, errors, null);
  }

  resetMsg(transMsg: string) {
    this.msg = transMsg;
    return this;
  }
}
