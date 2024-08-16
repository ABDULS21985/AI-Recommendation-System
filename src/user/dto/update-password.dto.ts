// src/user/dto/update-password.dto.ts
import { ApiProperty } from '@nestjs/swagger';

export class UpdatePasswordDto {
  @ApiProperty({ description: 'Current password of the user' })
  currentPassword: string;

  @ApiProperty({ description: 'New password of the user' })
  newPassword: string;
}
