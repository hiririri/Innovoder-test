import { ForbiddenException, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { UserDto } from "src/auth/dto/user.dto";
import { UpdateUserDto } from "./dto/updateUser.dto";
import { User, UserDocument } from "./user.schema";
import * as bcrypt from "bcrypt";

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async getUserByUsername(username: string) {
    return this.userModel.findOne({ username }).exec();
  }

  async updateUser(updateUserDto: UpdateUserDto) {
    const username = updateUserDto.username;
    if (!username) {
      throw new ForbiddenException("Username requiered");
    }

    updateUserDto.updatedAt = new Date();

    if (!updateUserDto.password) {
      updateUserDto.password = (
        await this.userModel.findOne({ username }).exec()
      ).password;
    } else {
      const saltOrRounds = 10;
      updateUserDto.password = await bcrypt.hash(
        updateUserDto.password,
        saltOrRounds
      );
    }

    return this.userModel.findOneAndUpdate({ username }, updateUserDto, {
      new: true,
    });
  }

  createUser(userDto: UserDto) {
    userDto.createdAt = new Date();
    userDto.updatedAt = new Date();
    return new this.userModel(userDto);
  }
}
