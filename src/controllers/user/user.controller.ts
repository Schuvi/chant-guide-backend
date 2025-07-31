import {
  Controller,
  Body,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  Put,
  Res,
  Query,
} from '@nestjs/common';
import { ApiOperation, ApiTags, ApiQuery } from '@nestjs/swagger';
import { CreateUserDto } from 'src/dtos/user/create-user.dto';
import { UpdateUserDto } from 'src/dtos/user/update-user.dto';
import { UserService } from 'src/services/user/user.service';
import * as bcrypt from 'bcrypt';
import { PaginationDto } from 'src/dtos/pagination/pagination.dto';

@ApiTags('Users')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @ApiOperation({ summary: 'Get all user' })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Current page number',
    default: 1,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Number of items per page',
    default: 10,
  })
  @ApiQuery({
    name: 'search',
    required: false,
    type: String,
    description: 'Search term for filtering',
  })
  @ApiQuery({
    name: 'searchField',
    required: false,
    type: String,
    description: 'Field to search on (e.g., "title", "content")',
  })
  async getAllUsers(@Query() paginationDto: PaginationDto, @Res() res: any) {
    try {
      const usersData = await this.userService.getAllUsers(paginationDto);
      return res.status(HttpStatus.OK).json({
        message: 'All users retrieved successfully',
        usersData,
      });
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Error retrieving users',
        error: error.message,
      });
    }
  }

  @Get(':userId')
  @ApiOperation({ summary: 'Get user by ID' })
  async getUserById(@Param('userId') userId: string, @Res() res: any) {
    try {
      const userData = await this.userService.getUserById(userId);
      return res.status(HttpStatus.OK).json({
        message: 'User retrieved successfully',
        data: userData,
      });
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Error retrieving user',
        error: error.message,
      });
    }
  }

  @Post()
  @ApiOperation({ summary: 'Create new user' })
  async createUser(@Body() createUserDto: CreateUserDto, @Res() res: any) {
    try {
      const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
      createUserDto.password = hashedPassword;

      await this.userService.createUser(createUserDto);
      return res.status(HttpStatus.CREATED).json({
        message: 'User created successfully',
      });
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Error creating user',
        error: error.message,
      });
    }
  }

  @Put(':userId')
  @ApiOperation({ summary: 'Update user by ID' })
  async updateUser(
    @Param('userId') userId: string,
    @Body() updateUserDto: UpdateUserDto,
    @Res() res: any,
  ) {
    try {
      await this.userService.updateUser(userId, updateUserDto);
      return res.status(HttpStatus.OK).json({
        message: 'User updated successfully',
      });
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Error updating user',
        error: error.message,
      });
    }
  }

  @Delete(':userId')
  @ApiOperation({ summary: 'Delete user by ID' })
  async deleteUser(@Param('userId') userId: string, @Res() res: any) {
    try {
      await this.userService.deleteUser(userId);
      return res.status(HttpStatus.OK).json({
        message: 'User deleted successfully',
      });
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Error deleting user',
        error: error.message,
      });
    }
  }
}
