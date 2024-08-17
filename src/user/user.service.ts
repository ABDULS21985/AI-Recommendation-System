import { Injectable, Logger, ConflictException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { Prisma, User } from '@prisma/client';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(private prisma: PrismaService) {}

  async createUser(data: CreateUserDto): Promise<User> {
    this.logger.log(`Creating a new user with email: ${data.email}`);
    try {
      const existingUser = await this.prisma.user.findUnique({ where: { email: data.email } });
      if (existingUser) {
        this.logger.warn(`User with email ${data.email} already exists`);
        throw new ConflictException('User with this email already exists');
      }

      const hashedPassword = await bcrypt.hash(data.password, 10);
      const user = await this.prisma.user.create({
        data: {
          ...data,
          password: hashedPassword,
        },
      });

      return user;
    } catch (error) {
      this.logger.error('Error creating user', error);
      throw error;
    }
  }

  async getUserById(id: string): Promise<User> {
    this.logger.log(`Fetching user with ID: ${id}`);
    try {
      const user = await this.prisma.user.findUnique({ where: { id } });
      if (!user) {
        this.logger.warn(`No user found with ID: ${id}`);
        throw new NotFoundException('User not found');
      }

      this.logger.log(`User found with ID: ${id}`);
      return user;
    } catch (error) {
      this.logger.error(`Error fetching user with ID: ${id}`, error.stack);
      throw error;
    }
  }

  async getAllUsers(): Promise<User[]> {
    this.logger.log('Fetching all users');
    try {
      const users = await this.prisma.user.findMany();
      this.logger.log(`Successfully retrieved ${users.length} users`);
      return users;
    } catch (error) {
      this.logger.error('Error fetching all users', error.stack);
      throw error;
    }
  }

  async searchUsers(filters: { email?: string; name?: string; location?: string }): Promise<User[]> {
    this.logger.log(`Searching users with filters: ${JSON.stringify(filters)}`);
    try {
      const { email, name, location } = filters;
      const where: Prisma.UserWhereInput = {
        email: email ? { contains: email, mode: 'insensitive' } : undefined,
        name: name ? { contains: name, mode: 'insensitive' } : undefined,
        location: location ? { contains: location, mode: 'insensitive' } : undefined,
      };

      const users = await this.prisma.user.findMany({ where });
      this.logger.log(`Found ${users.length} users matching the filters`);
      return users;
    } catch (error) {
      this.logger.error('Error searching users', error.stack);
      throw error;
    }
  }

  async findOne(id: string): Promise<User | null> {
    this.logger.log(`Finding user with ID: ${id}`);
    try {
      const user = await this.prisma.user.findUnique({ where: { id } });
      if (!user) {
        throw new NotFoundException('User not found');
      }
      return user;
    } catch (error) {
      this.logger.error(`Error finding user with ID: ${id}`, error.stack);
      throw error;
    }
  }

  async findByEmail(email: string): Promise<User> {
    this.logger.log(`Fetching user with email: ${email}`);
    try {
      const user = await this.prisma.user.findUnique({ where: { email } });
      if (!user) {
        this.logger.warn(`No user found with email: ${email}`);
        throw new NotFoundException('User not found');
      }

      this.logger.log(`User found with email: ${email}`);
      return user;
    } catch (error) {
      this.logger.error(`Error fetching user with email: ${email}`, error.stack);
      throw error;
    }
  }

  async updatePassword(userId: string, updatePasswordDto: UpdatePasswordDto): Promise<void> {
    const { currentPassword, newPassword } = updatePasswordDto;

    this.logger.log(`Updating password for user with ID: ${userId}`);

    const user = await this.prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
      this.logger.warn(`User not found with ID: ${userId}`);
      throw new NotFoundException('User not found');
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      this.logger.warn(`Incorrect current password for user with ID: ${userId}`);
      throw new UnauthorizedException('Current password is incorrect');
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    try {
      await this.prisma.user.update({
        where: { id: userId },
        data: { password: hashedNewPassword },
      });
      this.logger.log(`Password successfully updated for user with ID: ${userId}`);
    } catch (error) {
      this.logger.error(`Error updating password for user with ID: ${userId}`, error.stack);
      throw error;
    }
  }

  async resetUserPassword(userId: string, newPassword: string): Promise<void> {
    this.logger.log(`Resetting password for user with ID: ${userId}`);
    try {
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      await this.prisma.user.update({
        where: { id: userId },
        data: { password: hashedPassword },
      });
      this.logger.log(`Password successfully reset for user with ID: ${userId}`);
    } catch (error) {
      this.logger.error(`Error resetting password for user with ID: ${userId}`, error.stack);
      throw error;
    }
  }
  async updateUserProfile(userId: string, updateUserDto: UpdateUserDto): Promise<User> {
    this.logger.log(`Updating user profile for user ID: ${userId}`);
    
    try {
      const user = await this.prisma.user.update({
        where: { id: userId },
        data: updateUserDto,
      });
  
      if (!user) {
        throw new NotFoundException(`User with ID ${userId} not found`);
      }
  
      this.logger.log(`User profile updated for user ID: ${userId}`);
      return user;
    } catch (error) {
      this.logger.error(`Error updating profile for user ID: ${userId}`, error.stack);
      throw error;
    }
  }
}  