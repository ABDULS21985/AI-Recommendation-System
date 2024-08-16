// src/user/dto/create-user.dto.ts
import { IsString, IsEmail, IsOptional, IsInt } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ example: 'Dr. Katanga' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'Secured$32111111' })
  @IsEmail()
  password: string;

  @ApiProperty({ example: 'drkatanga@example.com' })
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

  @ApiProperty({ example: 'Abuja' })
  @IsOptional()
  @IsString()
  location?: string;
}
