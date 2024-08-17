// src/auth/auth.controller.ts
import { Controller, Post, Patch, Body, Logger, UseGuards, Get} from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { UserDto } from './dto/user.dto'; // Ensure this path is correct
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { JwtAuthGuard } from'../auth/jwt-auth.guard';
import { GetProfileDto } from './dto/get.profile.dto';

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

  @Post('logout')
  @ApiOperation({ summary: 'Logout a user and revoke their refresh token' })
  @ApiBody({ type: RefreshTokenDto }) // Swagger documentation for request body
  @ApiResponse({ status: 200, description: 'Refresh token revoked.' })
  @ApiResponse({ status: 400, description: 'Invalid refresh token' })
  async logout(@Body() refreshTokenDto: RefreshTokenDto) {
    this.logger.log('Logout request received');
    await this.authService.logout(refreshTokenDto.refreshToken);
    this.logger.log('Logout successful');
  }

  @UseGuards(JwtAuthGuard) // Protect the route with JWT authentication
  @Patch('profile')
  @ApiOperation({ summary: 'Update the user profile' })
  @ApiBody({ type: UserDto }) // Swagger documentation for request body
  @ApiResponse({ status: 200, description: 'User profile updated.' })
  @ApiResponse({ status: 400, description: 'Invalid user data' })
  async updateProfile(@Body() userDto: UserDto) {
    this.logger.log(`Update profile request for user: ${userDto.email}`);
    const result = await this.authService.updateProfile(userDto);
    this.logger.log(`Profile updated for user: ${userDto.email}`);
    return result;
  }

  @UseGuards(JwtAuthGuard) // Protect the route with JWT authentication
  @Get('profile')
  @ApiOperation({ summary: 'Get the user profile' })
  @ApiResponse({ status: 200, description: 'User profile returned.' })
  async getProfile(@Body() getProfileDto: GetProfileDto) {
    this.logger.log(`Profile request for user with email: ${getProfileDto.email}`);
    
    const result = await this.authService.getProfile(getProfileDto.email);
    
    this.logger.log(`Profile returned for user with email: ${getProfileDto.email}`);
    return result;
  }
}