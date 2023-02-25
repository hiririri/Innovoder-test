import { ForbiddenException, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { CreateUserDto } from "./dto/createUser.dto";
import { UpdateUserDto } from "./dto/updateUser.dto";
import { User, UserDocument } from "./user.schema";
import * as bcrypt from "bcrypt";

@Injectable()
export class UserService {
  /**
   * @ignore
   */
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  /**
   * A method that fetches a user given by the username from the database
   * @returns an user
   */
  async getUserByUsername(username: string) {
    return this.userModel.findOne({ username }).exec();
  }

  /**
   * A method that updates the user given by username from the database
   * @returns user updated
   */
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
        saltOrRounds,
      );
    }

    return this.userModel.findOneAndUpdate({ username }, updateUserDto, {
      new: true,
    });
  }

  /**
   * A method that creates an user in the database
   * @returns user created
   */
  createUser(createUserDto: CreateUserDto) {
    const user = {
      username: createUserDto.username,
      password: createUserDto.password,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    return new this.userModel(user);
  }

  /**
   * A method that deletes an user given by username from the database
   * @returns user deleted
   */
  deleteUser(username: string) {
    return this.userModel.findOneAndDelete(
      { username: username },
      { new: true },
    );
  }
}
