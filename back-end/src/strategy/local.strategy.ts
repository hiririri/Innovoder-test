import { AuthService } from 'src/auth/auth.service';
import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  /**
   * @ignore
   */
  constructor(private authService: AuthService) {
    super();
  }

  /**
   * A method that validates if the input username and password are correct from the database.
   * @returns if correct, return user authenticated, else throw an UnauthorizedException.
   */
  async validate(username: string, password: string): Promise<any> {
    const user = await this.authService.validateUser(username, password);
    if (!user) {
      throw new UnauthorizedException({
        message: 'You have entered a wrong username or password',
      });
    }
    return user;
  }
}
