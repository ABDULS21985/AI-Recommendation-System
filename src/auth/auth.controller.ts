// src/auth/auth.controller.ts
import { Controller, Post, Body, Logger } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { UserDto } from './dto/user.dto'; // Ensure this path is correct
import { RefreshTokenDto } from './dto/refresh-token.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name); // Initialize Logger

  constructor(private authService: AuthService) {}

  @Post('login')
  @ApiOperation({ summary: 'Login a user and return access and refresh tokens' })
  @ApiBody({ type: UserDto }) // Swagger documentation for request body
  @ApiResponse({ status: 200, description: 'Tokens successfully returned.' })
  @ApiResponse({ status: 400, description: 'Invalid user data' })
  async login(@Body() userDto: UserDto) {
    this.logger.log(`Login request for user: ${userDto.email}`);
    const result = await this.authService.login(userDto);
    this.logger.log(`Login successful for user: ${userDto.email}`);
    return result;
  }

  @Post('refresh')
  @ApiOperation({ summary: 'Refresh the access token using a refresh token' })
  @ApiBody({ type: RefreshTokenDto }) // Swagger documentation for request body
  @ApiResponse({ status: 200, description: 'New access token returned.' })
  @ApiResponse({ status: 400, description: 'Invalid refresh token' })
  async refresh(@Body() refreshTokenDto: RefreshTokenDto) {
    this.logger.log('Refresh token request received');
    const result = await this.authService.refreshToken(refreshTokenDto.refreshToken);
    this.logger.log('Refresh token processed successfully');
    return result;
  }
}
