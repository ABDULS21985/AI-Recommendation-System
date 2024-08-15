// src/notification/dto/update-notification-preference.dto.ts
import { IsEnum, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Frequency } from '@prisma/client';

export class UpdateNotificationPreferenceDto {
  @ApiProperty({ description: 'The frequency of email notifications', example: 'DAILY', enum: Frequency })
  @IsEnum(Frequency)
  frequency: Frequency;

  @ApiProperty({ description: 'The ID of the user', example: '7c0e9d85-b499-435b-8a92-5c9d17cc56a2' })
  @IsUUID()
  userId: string;
}