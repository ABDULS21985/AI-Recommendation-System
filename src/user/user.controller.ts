// src/user/user.controller.ts
import { Controller, Get, Post, Param, Body } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';

@Controller('users')
@ApiTags('Users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new user' })
  @ApiResponse({ status: 201, description: 'User successfully created.' })
  @ApiBody({
    type: CreateUserDto,
    description: 'Payload to create a new user',
    examples: {
      example1: {
        summary: 'Sample user payload',
        value: {
          name: 'John Doe',
          email: 'johndoe@example.com',
          age: 25,
          gender: 'Male',
          location: 'New York',
        },
      },
    },
  })
  createUser(@Body() data: CreateUserDto) {
    return this.userService.createUser(data);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get user by ID' })
  @ApiResponse({ status: 200, description: 'User data retrieved.' })
  getUserById(@Param('id') id: string) {
    return this.userService.getUserById(id);
  }
}
