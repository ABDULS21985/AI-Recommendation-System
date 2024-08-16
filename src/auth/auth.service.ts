// src/auth/auth.service.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
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
    const user = await this.userService.findByEmail(email);
    if (user && await bcrypt.compare(password, user.password)) {
      return user;
    }
    return null;
  }

  async login(userDto: UserDto) {
    const user = await this.validateUser(userDto.email, userDto.password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const payload = { email: user.email, sub: user.id };
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
      throw new UnauthorizedException('Invalid refresh token');
    }
  }
}
