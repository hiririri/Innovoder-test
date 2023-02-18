import { Controller } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('/api/v1/users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // @UseGuards(AuthGuard('local'))
  // @Get('username')
  // getUserByUsername(@Param() param) {
  //   return this.userService.getUserByUsername(param.username);
  // }
}
