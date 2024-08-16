// src/auth/dto/refresh-token.dto.ts
import { ApiProperty } from '@nestjs/swagger';

export class RefreshTokenDto {
  @ApiProperty({ example: 'your-refresh-token', description: 'The refresh token' })
  refreshToken: string;
}
