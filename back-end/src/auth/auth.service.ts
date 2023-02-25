import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserService } from 'src/users/user.service';
import { CreateUserDto } from '../users/dto/createUser.dto';

@Injectable()
export class AuthService {
  /**
   * @ignore
   */
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  /**
   * A method that checks if the input username and password are correct.
   * @returns user authenticated
   */
  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.userService.getUserByUsername(username);
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

  /**
   * A method that returns a generated jwt token from the user's input
   * @returns token
   */
  async login(payload: any) {
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  /**
   * A method that registe a new user in the database.
   * @returns user id registed
   */
  async register(createUserDto: CreateUserDto) {
    // validate DTO
    if (!createUserDto.username) {
      throw new BadRequestException('Username requiered.');
    }
    const createdUser = this.userService.createUser(createUserDto);
    // check if user exists already
    const user = await this.userService.getUserByUsername(createdUser.username);
    if (user) {
      throw new BadRequestException('User already exists');
    }
    // Hash Password
    const saltOrRounds = 10;
    createdUser.password = await bcrypt.hash(
      createdUser.password,
      saltOrRounds,
    );

    return { id: (await createdUser.save())._id };
  }

  /**
   * A method that compare the input password and the password stocked in the database.
   * @returns true if input password is correct, else false.
   */
  async comparePassword(password: string, hash) {
    return await bcrypt.compare(password, hash);
  }
}
