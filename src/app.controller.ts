import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { I18n, I18nContext, i18nValidationMessage } from 'nestjs-i18n';
import { ErrorCode } from './common/error.code';
import { BusinessException } from './exception/business.exceptions';
import {
  IsBoolean,
  IsDefined,
  IsEmail,
  IsNotEmpty,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

// ~========= example ===================
export class ExtraUserDto {
  @IsBoolean({ message: 'validation.INVALID_BOOLEAN' })
  subscribeToEmail: string;

  @Min(5, {
    message: i18nValidationMessage('validation.MIN', { message: 'COOL' }),
  })
  min: number;

  @Max(10, {
    message: i18nValidationMessage('validation.MAX', { message: 'SUPER' }),
  })
  max: number;
}

export class CreateUserDto {
  @IsNotEmpty({ message: i18nValidationMessage('validation.NOT_EMPTY') })
  @IsEmail({}, { message: i18nValidationMessage('validation.INVALID_EMAIL') })
  email: string;

  @IsNotEmpty({ message: i18nValidationMessage('validation.NOT_EMPTY') })
  password: string;

  @ValidateNested()
  @IsDefined()
  @Type(() => ExtraUserDto)
  extra: ExtraUserDto;
}

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  // ~ ============= example =========================

  @Post()
  create(@Body() createUserDto: CreateUserDto): any {
    return createUserDto;
  }

  @Get('ping')
  async ping() {
    return 'pong';
  }

  @Get('test/1')
  async i18nTest1(@I18n() i18n: I18nContext) {
    return i18n.t('test.HELLO');
  }

  @Get('/test/exception')
  async testException(): Promise<string> {
    throw new BusinessException(ErrorCode.INVALID_TOKEN);
  }
}
