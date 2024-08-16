import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { UserDto } from './dto/user.dto';
import { User } from '@prisma/client';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name); // Initialize Logger

  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<User | null> {
    this.logger.log(`Validating user with email: ${email}`);
    const user = await this.userService.findByEmail(email);
    if (user) {
      this.logger.log(`User found: ${email}`);
      const isMatch = await bcrypt.compare(password, user.password);
      if (isMatch) {
        return user;
      }
    }
    this.logger.warn(`Invalid credentials for email: ${email}`);
    return null;
  }
  

  async login(userDto: UserDto) {
    this.logger.log(`Login request for user: ${userDto.email}`);
    const user = await this.validateUser(userDto.email, userDto.password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const payload = { email: user.email, sub: user.id };
    this.logger.log(`Login successful for user: ${userDto.email}`);
    return {
      access_token: this.jwtService.sign(payload),
      refresh_token: await this.generateRefreshToken(user.id),
    };
  }

  async generateRefreshToken(userId: string) {
    return this.jwtService.sign(
      { sub: userId },
      { secret: process.env.JWT_REFRESH_SECRET, expiresIn: '7d' }
    );
  }

  async refreshToken(token: string) {
    try {
      const payload = this.jwtService.verify(token, { secret: process.env.JWT_REFRESH_SECRET });
      const user = await this.userService.findByEmail(payload.email); // Use existing method
      if (user) {
        const newAccessToken = this.jwtService.sign({ email: user.email, sub: user.id });
        return { access_token: newAccessToken };
      }
    } catch (e) {
      this.logger.error('Error refreshing token', e.stack);
      throw new UnauthorizedException('Invalid refresh token');
    }
  }
}
