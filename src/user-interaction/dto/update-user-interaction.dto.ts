import { PartialType } from '@nestjs/mapped-types';
import { CreateUserInteractionDto } from './create-user-interaction.dto';

export class UpdateUserInteractionDto extends PartialType(CreateUserInteractionDto) {}
