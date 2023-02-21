import { AuthService } from './auth.service';
import { Controller, UseGuards, Post, Body, Param, HttpCode } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Controller('/api/v1/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(AuthGuard('local'))
  @Post('/login')
  @HttpCode(200)
  async login(@Body() payload) {
    return this.authService.login(payload);
  }

  @Post('/register')
  @HttpCode(201)
  register(@Body() userInfo) {
    return this.authService.register(userInfo);
  }
}
