import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name); // Initialize Logger

  constructor(private prisma: PrismaService) {}

  async createUser(data: CreateUserDto) {
    this.logger.log(`Creating a new user with email: ${data.email}`);
    try {
      const user = await this.prisma.user.create({ data });
      this.logger.log(`User successfully created with ID: ${user.id}`);
      return user;
    } catch (error) {
      this.logger.error('Error creating user', error.stack);
      throw error;
    }
  }

  async getUserById(id: string) {
    this.logger.log(`Fetching user with ID: ${id}`);
    try {
      const user = await this.prisma.user.findUnique({ where: { id } });
      if (user) {
        this.logger.log(`User found with ID: ${id}`);
        return user;
      } else {
        this.logger.warn(`No user found with ID: ${id}`);
        throw new Error('User not found');
      }
    } catch (error) {
      this.logger.error(`Error fetching user with ID: ${id}`, error.stack);
      throw error;
    }
  }

  async getAllUsers() {
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

  // Search users by email, name, and location
  async searchUsers(filters: { email?: string; name?: string; location?: string }) {
    this.logger.log(`Searching users with filters: ${JSON.stringify(filters)}`);
    
    try {
      const { email, name, location } = filters;

      const where: Prisma.UserWhereInput = {
        email: email ? { contains: email, mode: 'insensitive' } : undefined,
        name: name ? { contains: name, mode: 'insensitive' } : undefined,
        location: location ? { contains: location, mode: 'insensitive' } : undefined,
      };

      const users = await this.prisma.user.findMany({ where });
      this.logger.log(`Successfully retrieved ${users.length} users based on filters`);
      return users;
    } catch (error) {
      this.logger.error('Error searching users', error.stack);
      throw error;
    }
  }
}
