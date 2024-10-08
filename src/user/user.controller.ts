import { Controller, Get, Post, Param, Body, Query, Logger, Patch, ConflictException } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiQuery } from '@nestjs/swagger';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { ResetPasswordDto } from './dto/reset-password.dto';

@Controller('users')
@ApiTags('Users')
export class UserController {
  private readonly logger = new Logger(UserController.name); // Initialize Logger

  constructor(private readonly userService: UserService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new user' })
  @ApiResponse({ status: 201, description: 'User successfully created.' })
  @ApiResponse({ status: 409, description: 'User with this email already exists.' })
  @ApiBody({
    type: CreateUserDto,
    description: 'Payload to create a new user',
    examples: {
      example1: {
        summary: 'Sample user payload',
        value: {
          name: 'Dr Katanga',
          email: 'drkatanga@example.com',
          age: 25,
          gender: 'Male',
          location: 'Abuja',
        },
      },
    },
  })
  async createUser(@Body() data: CreateUserDto) {
    this.logger.log('Creating a new user with email: ' + data.email);
    try {
      const user = await this.userService.createUser(data);
      this.logger.log('User successfully created with ID: ' + user.id);
      return user;
    } catch (error) {
      if (error instanceof ConflictException) {
        throw new ConflictException('A user with this email already exists');
      }
      this.logger.error('Failed to create user', error.stack);
      throw error;
    }
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get user by ID' })
  @ApiResponse({ status: 200, description: 'User data retrieved.' })
  async getUserById(@Param('id') id: string) {
    this.logger.log('Fetching user with ID: ' + id);
    try {
      const user = await this.userService.getUserById(id);
      if (user) {
        this.logger.log('User data retrieved for ID: ' + id);
        return user;
      } else {
        this.logger.warn('User not found with ID: ' + id);
        throw new Error('User not found');
      }
    } catch (error) {
      this.logger.error('Failed to retrieve user with ID: ' + id, error.stack);
      throw error;
    }
  }

  @Get()
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({ status: 200, description: 'List of all users.' })
  async getAllUsers() {
    this.logger.log('Fetching all users');
    try {
      const users = await this.userService.getAllUsers();
      this.logger.log(`Successfully retrieved ${users.length} users`);
      return users;
    } catch (error) {
      this.logger.error('Failed to retrieve users', error.stack);
      throw error;
    }
  }

  @Get('search')
  @ApiOperation({ summary: 'Search for users by email, name, or location' })
  @ApiQuery({ name: 'email', required: false, description: 'Search by user email' })
  @ApiQuery({ name: 'name', required: false, description: 'Search by user name' })
  @ApiQuery({ name: 'location', required: false, description: 'Search by user location' })
  @ApiResponse({ status: 200, description: 'Successfully retrieved users based on search criteria.' })
  async searchUsers(
    @Query('email') email?: string,
    @Query('name') name?: string,
    @Query('location') location?: string,
  ) {
    this.logger.log('Received request to search for users with filters');
    try {
      const filters = { email, name, location };
      const users = await this.userService.searchUsers(filters);
      this.logger.log(`Successfully retrieved ${users.length} users based on search criteria`);
      return users;
    } catch (error) {
      this.logger.error('Failed to search for users', error.stack);
      throw error;
    }
  }

  @Patch(':id/password')
  @ApiOperation({ summary: 'Update user password' })
  @ApiBody({ type: UpdatePasswordDto })
  async updatePassword(
    @Param('id') id: string,
    @Body() updatePasswordDto: UpdatePasswordDto,
  ) {
    this.logger.log(`Updating password for user with ID: ${id}`);
    try {
      await this.userService.updatePassword(id, updatePasswordDto);
      this.logger.log(`Password successfully updated for user with ID: ${id}`);
    } catch (error) {
      this.logger.error(`Failed to update password for user with ID: ${id}`, error.stack);
      throw error;
    }
  }

  @Patch(':id/password/reset')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiOperation({ summary: 'Reset a user\'s password (admin only)' })
  @ApiBody({
    description: 'New password for the user',
    type: ResetPasswordDto, 
  })
  async resetPassword(
    @Param('id') id: string,
    @Body() resetPasswordDto: ResetPasswordDto,
  ) {
    this.logger.log(`Resetting password for user with ID: ${id}`);
    try {
      await this.userService.resetUserPassword(id, resetPasswordDto.newPassword);
      this.logger.log(`Password successfully reset for user with ID: ${id}`);
    } catch (error) {
      this.logger.error(`Failed to reset password for user with ID: ${id}`, error.stack);
      throw error;
    }
  }




  
}
