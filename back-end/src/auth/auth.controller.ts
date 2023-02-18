import { AuthService } from './auth.service';
import { Controller, UseGuards, Post, Body, Param } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Controller('/api/v1/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(AuthGuard('local'))
  @Post('/login')
  async login(@Body() payload) {
    return this.authService.login(payload);
  }

  @Post('/register')
  register(@Body() userInfo) {
    return this.authService.register(userInfo);
  }
}
