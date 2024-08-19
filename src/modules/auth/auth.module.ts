import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';

import { JwtStrategy } from './jwt.strategy';
import { PublicStrategy } from './public.strategy';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { ApiConfigService } from '../../config/api-config.service';

const jwtModule = JwtModule.registerAsync({
  useFactory: (configService: ApiConfigService) => ({
    privateKey: configService.authConfig.privateKey,
    publicKey: configService.authConfig.publicKey,
    signOptions: {
      algorithm: 'RS256',
      //     expiresIn: configService.getNumber('JWT_EXPIRATION_TIME'),
    },
    verifyOptions: {
      algorithms: ['RS256'],
    },
    // if you want to use token with expiration date
    // signOptions: {
    //     expiresIn: configService.getNumber('JWT_EXPIRATION_TIME'),
    // },
  }),
  inject: [ApiConfigService],
});

@Module({
  imports: [PassportModule.register({ defaultStrategy: 'jwt' }), jwtModule],
  controllers: [AuthController],
  providers: [JwtStrategy, PublicStrategy],
})
export class AuthModule {}
