import { Controller, Get, UseGuards, Request, Query } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { JwtService } from '@nestjs/jwt';

@Controller('auth')
export class AuthController {
  constructor(private jwtService: JwtService) {}

  @UseGuards(AuthGuard('jwt'))
  @Get('user')
  async user(@Request() req) {
    return req.user;
  }

  @UseGuards(AuthGuard('public'))
  @Get('public')
  async public() {
    return 'public';
  }

  @Get('login')
  async login(
    @Query('userAddr') userAddr: string,
    @Query('signature') signature: string,
  ) {
    // check signature same as userAddr
    return await this.createAccessToken({ userAddr });
  }

  createAccessToken = (data: { userAddr: string }) =>
    this.jwtService.signAsync({
      userAddr: data.userAddr,
    });
}
