// src/users/topics.controller.ts
import { Body, Controller, Post, Get, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { KafkaService } from './kafka.service';
import { CreateTopicDto } from './dto/create-topic.dto';

@Controller('users/createTopics')
@UseGuards(AuthGuard('jwt'))
export class TopicsController {
  constructor(private readonly kafkaService: KafkaService) {}

  @Post()
  async createTopic(@Body() createTopicDto: CreateTopicDto, @Request() req) {
    console.log("valor do req.user: " + req.user['id'])
    const userId = req.user['id']; // Assumindo que o ID do usuário está no req.user
    const result = await this.kafkaService.createTopic(userId, createTopicDto);
    return result;
  }

}
