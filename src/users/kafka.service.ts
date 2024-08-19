import { Injectable } from '@nestjs/common';
import { Kafka } from 'kafkajs';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Topic } from './schemas/topic.schema';
import { CreateTopicDto } from './dto/create-topic.dto';

@Injectable()
export class KafkaService {
  private kafka: Kafka;
  private producer;

  constructor(@InjectModel(Topic.name) private topicModel: Model<Topic>) {
    this.kafka = new Kafka({
      clientId: 'my-app',
      brokers: ['localhost:29092'] // Ajuste conforme necessário
    });

    this.producer = this.kafka.producer();
    this.producer.connect().catch(err => {
      console.error('Erro ao conectar o producer ao Kafka:', err);
    });
  }

  async createTopic(userId: string, createTopicDto: CreateTopicDto) {
    const { topicName } = createTopicDto;

    if (!topicName) {
      throw new Error('O campo topicName é obrigatório.');
    }

    try {
      await this.producer.send({
        topic: topicName,
        messages: [{ value: 'Teste de criação de tópico' }]
      });

      const topic = new this.topicModel({ topicName, userId });
      await topic.save();

      return { message: 'Tópico criado com sucesso', topic };
    } catch (error) {
      console.error('Erro ao criar o tópico:', error);
      throw new Error('Erro ao criar o tópico');
    }
  }
}
