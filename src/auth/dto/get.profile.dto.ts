import { IsString, IsOptional, IsEmail, IsInt } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class GetProfileDto {
  @ApiProperty({ example: 'drkatanga@example.com' })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiProperty({ example: 'Dr. Katanga' })
  @IsOptional()
  @IsString()
  name?: string;

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

  @ApiProperty({ example: 'Engineer' })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiProperty({ example: 'A tech enthusiast with a passion for coding.' })
  @IsOptional()
  @IsString()
  bio?: string;

  @ApiProperty({ example: '+2348012345678' })
  @IsOptional()
  @IsString()
  phoneNumber?: string;

  @ApiProperty({ example: 'Nigeria' })
  @IsOptional()
  @IsString()
  country?: string;

  @ApiProperty({ example: 'https://example.com/avatar.jpg' })
  @IsOptional()
  @IsString()
  avatarUrl?: string;
}
