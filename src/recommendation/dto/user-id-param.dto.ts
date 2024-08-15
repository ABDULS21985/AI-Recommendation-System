import { IsUUID } from 'class-validator';

export class UserIdParamDto {
  @IsUUID()
  userId: string;
}
