// src/auth/auth.service.ts
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { UserDto } from './dto/user.dto';
import { User } from '@prisma/client';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.userService.findByEmail(email); // Ensure this method exists
    if (user && await bcrypt.compare(password, user.password)) { // Compare hashed passwords
      return user;
    }
    return null;
  }

  async login(userDto: UserDto) {
    const user = await this.validateUser(userDto.email, userDto.password);
    if (!user) {
      throw new Error('Invalid credentials');
    }
    const payload = { username: user.email, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
      refresh_token: await this.generateRefreshToken(user.id),
    };
  }

  async generateRefreshToken(userId: string) {
    const refreshToken = this.jwtService.sign({ sub: userId }, { secret: process.env.JWT_REFRESH_SECRET, expiresIn: '7d' });
    return refreshToken;
  }

  async refreshToken(token: string) {
    try {
      const payload = this.jwtService.verify(token, { secret: process.env.JWT_REFRESH_SECRET });
      const user = await this.userService.findByEmail(payload.username); // Adjust method if needed
      if (user) {
        const newAccessToken = this.jwtService.sign({ username: user.email, sub: user.id });
        return { access_token: newAccessToken };
      }
    } catch (e) {
      throw new Error('Invalid refresh token');
    }
  }
}
