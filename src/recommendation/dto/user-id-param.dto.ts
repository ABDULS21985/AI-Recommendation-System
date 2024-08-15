import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class UserIdParamDto {
  @ApiProperty({ description: 'The ID of the user', example: '7c0e9d85-b499-435b-8a92-5c9d17cc56a2' })
  @IsUUID()
  userId: string;
}
