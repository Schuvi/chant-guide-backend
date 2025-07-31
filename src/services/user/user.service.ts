import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreateUserDto } from 'src/dtos/user/create-user.dto';
import { UpdateUserDto } from 'src/dtos/user/update-user.dto';
import { IUser } from 'src/interfaces/user/user.interface';
import { Model, ProjectionType } from 'mongoose';
import { PaginatedResponseDto } from 'src/dtos/pagination/pagination-response.dto';
import { PaginationDto } from 'src/dtos/pagination/pagination.dto';
import { newPaginate } from 'src/common/utils/newPagination.util';

@Injectable()
export class UserService {
  constructor(@InjectModel('user') private userModel: Model<IUser>) {}

  async createUser(createUserDto: CreateUserDto): Promise<IUser> {
    const newUser = await new this.userModel(createUserDto);
    return newUser.save();
  }

  async getAllUsers(
    paginationDto: PaginationDto,
  ): Promise<PaginatedResponseDto<IUser>> {
    const query = {};
    const except: ProjectionType<IUser> = { password: 0, __v: 0 };

    const usersData = await newPaginate<IUser>(
      this.userModel,
      query,
      except,
      paginationDto,
    );

    if (!usersData || usersData.data.length === 0) {
      throw new NotFoundException('No users found');
    }

    return usersData;
  }

  async getUserById(userId: string): Promise<IUser> {
    const existingUser = await this.userModel.findById(userId).exec();

    if (!existingUser) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    return existingUser;
  }

  async deleteUser(userId: string): Promise<IUser> {
    const deleteUser = await this.userModel.findByIdAndDelete(userId).exec();

    if (!deleteUser) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    return deleteUser;
  }

  async updateUser(
    userId: string,
    updateUserDto: UpdateUserDto,
  ): Promise<IUser> {
    const updateFields = {
      name: updateUserDto.name,
      email: updateUserDto.email,
    };

    const existingUser = await this.userModel.findByIdAndUpdate(
      userId,
      updateFields,
      {
        new: true,
      },
    );

    if (!existingUser) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    return existingUser;
  }
}
