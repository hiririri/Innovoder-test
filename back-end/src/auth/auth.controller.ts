import { AuthService } from './auth.service';
import { Controller, UseGuards, Post, Body, Param, HttpCode } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Controller('/api/v1/auth')
export class AuthController {
  /**
   * @ignore
   */
  constructor(private authService: AuthService) {}

  /**
   * A methode that allows user to login
   * @param payload user input username and passowrd.
   * @returns jwt token genrated.
   */
  @UseGuards(AuthGuard('local'))
  @Post('/login')
  @HttpCode(200)
  async login(@Body() payload) {
    return this.authService.login(payload);
  }

  /**
   * A methode that allows user to registe
   * @param userInfo user input information
   * @returns user registed
   */
  @Post('/register')
  @HttpCode(201)
  register(@Body() userInfo) {
    return this.authService.register(userInfo);
  }
}
