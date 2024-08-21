// src/users/kafka.service.ts
import { Injectable } from '@nestjs/common';
import { Kafka, Admin, Consumer } from 'kafkajs';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Topic } from './schemas/topic.schema';

@Injectable()
export class KafkaService {
  private kafka: Kafka;
  private admin: Admin;
  private consumer: Consumer;

  constructor(
    @InjectModel(Topic.name) private readonly topicModel: Model<Topic>,
  ) {
    this.kafka = new Kafka({
      clientId: 'my-app',
      brokers: ['localhost:29092'], // Ajuste conforme necessário
    });

    this.admin = this.kafka.admin();
    this.consumer = this.kafka.consumer({ groupId: 'your-group-id' });
  }

  async createTopic(userId: string, createTopicDto: any) {
    const topicName = `${userId}-${createTopicDto.topicName}`;

    // Criação do tópico no Kafka
    await this.admin.connect();
    await this.admin.createTopics({
      topics: [{ topic: topicName, numPartitions: 1, replicationFactor: 1 }],
    });
    await this.admin.disconnect();

    // Salvando a informação do tópico no banco de dados
    const createdTopic = new this.topicModel({ topicName, userId });
    const savedTopic = await createdTopic.save();

    // Retornando o formato desejado
    return {
      message: 'Tópico criado com sucesso',
      topic: savedTopic,
    };
  }

  async listTopics(userId: string) {
    // Buscando os tópicos do usuário no banco de dados
    const userTopics = await this.topicModel.find({ userId }).exec();
    return userTopics;
  }

  async getTopicById(userId: string, topicId: string) {
    // Buscando o tópico do banco de dados para obter o nome
    const topic = await this.topicModel.findOne({ _id: topicId, userId }).exec();
    if (!topic) {
      throw new Error('Tópico não encontrado ou você não tem permissão para acessá-lo');
    }

    // Obtendo mensagens do tópico do Kafka
    const messages = await this.getMessagesFromTopic(topic.topicName);
    return {
      topic: topic.topicName,
      messages,
    };
  }

  private async getMessagesFromTopic(topic: string) {
    const messages = [];
  
    await this.consumer.connect();
    try {
      await this.consumer.subscribe({ topic, fromBeginning: true });
  
      await this.consumer.run({
        eachMessage: async ({ message }) => {
          messages.push({
            key: message.key?.toString(),
            value: message.value?.toString(),
          });
        },
      });

      // Espera um pouco para garantir que as mensagens foram consumidas
      await new Promise(resolve => setTimeout(resolve, 1000));
      return messages;
    } catch (error) {
      console.error('Error getting messages from topic:', error);
      throw error;
    } finally {
      await this.consumer.disconnect();
    }
  }
}
