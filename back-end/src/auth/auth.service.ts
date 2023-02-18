import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserService } from 'src/users/user.service';
import { UserDto } from './dto/user.dto';

@Injectable()
export class AuthService {
  userModel: any;
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.userService.getUserByUsername(email);
    if (!user) {
      throw new UnauthorizedException({
        message: 'User dose not exist.',
      });
    }
    if (user && (await this.comparePassword(pass, user.password))) {
      return user;
    }
    return null;
  }

  async login(payload: any) {
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async register(userDto: UserDto) {
    // validate DTO

    const createdUser = this.userService.createUser(userDto);
    // check if user exists already
    const user = await this.userService.getUserByUsername(createdUser.username);
    if (user) {
      throw new BadRequestException();
    }
    // Hash Password
    const saltOrRounds = 10;
    createdUser.password = await bcrypt.hash(
      createdUser.password,
      saltOrRounds,
    );

    return { id: (await createdUser.save())._id };
  }

  async comparePassword(password: string, hash) {
    return await bcrypt.compare(password, hash);
  }
}
