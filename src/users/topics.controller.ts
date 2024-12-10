import { Controller, Post, Get, Delete, UseGuards, Request, Body, Param } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { KafkaService } from './kafka.service';
import { CreateTopicDto } from './dto/create-topic.dto';

@Controller('users')
@UseGuards(AuthGuard('jwt'))
export class TopicsController {
  constructor(private readonly kafkaService: KafkaService) {}

  @Post('createTopics')
  async createTopic(@Body() createTopicDto: CreateTopicDto, @Request() req) {
    const userId = req.user['id'];
    const result = await this.kafkaService.createTopic(userId, createTopicDto);
    return result;
  }

  @Get('listTopics')
  async listTopics(@Request() req) {
    const userId = req.user['id'];
    const result = await this.kafkaService.listTopics(userId);
    return result;
  }

  @Get('listTopics/:idTopic')
  async getTopicById(@Request() req, @Param('idTopic') idTopic: string) {
    const userId = req.user['id'];
    const result = await this.kafkaService.getTopicById(userId, idTopic);
    return result;
  }

  @Delete('deleteTopic/:idTopic')
  async deleteTopic(@Request() req, @Param('idTopic') idTopic: string) {
    const userId = req.user['id'];
    const result = await this.kafkaService.deleteTopic(userId, idTopic);
    return result;
  }
}
