// src/users/dto/create-topic.dto.ts
import { IsString } from 'class-validator';

export class CreateTopicDto {
  @IsString()
  readonly topicName: string;
}
