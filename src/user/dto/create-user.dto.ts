// src/user/dto/create-user.dto.ts
import { IsString, IsEmail, IsOptional, IsInt } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ example: 'John Doe' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'johndoe@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 25 })
  @IsOptional()
  @IsInt()
  age?: number;

  @ApiProperty({ example: 'Male' })
  @IsOptional()
  @IsString()
  gender?: string;

  @ApiProperty({ example: 'New York' })
  @IsOptional()
  @IsString()
  location?: string;
}
