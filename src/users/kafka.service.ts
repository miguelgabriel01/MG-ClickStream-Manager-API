import { Injectable } from '@nestjs/common';
import { Kafka, Admin, Consumer } from 'kafkajs';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Topic } from './schemas/topic.schema';

@Injectable()
export class KafkaService {
  private kafka: Kafka;
  private admin: Admin;

  constructor(
    @InjectModel(Topic.name) private readonly topicModel: Model<Topic>,
  ) {
    this.kafka = new Kafka({
      clientId: 'my-app',
      brokers: ['localhost:29092'], // Ajuste conforme necessário
    });

    this.admin = this.kafka.admin();
  }

  async createTopic(userId: string, createTopicDto: any) {
    const topicName = `${userId}-${createTopicDto.topicName}`;

    await this.admin.connect();
    await this.admin.createTopics({
      topics: [{ topic: topicName, numPartitions: 1, replicationFactor: 1 }],
    });
    await this.admin.disconnect();

    const createdTopic = new this.topicModel({ topicName, userId });
    const savedTopic = await createdTopic.save();

    return {
      message: 'Tópico criado com sucesso',
      topic: savedTopic,
    };
  }

  async listTopics(userId: string) {
    const userTopics = await this.topicModel.find({ userId }).exec();
    return userTopics;
  }

  async getTopicById(userId: string, topicId: string) {
    const topic = await this.topicModel.findOne({ _id: topicId, userId }).exec();
    if (!topic) {
      throw new Error('Tópico não encontrado ou você não tem permissão para acessá-lo');
    }

    const messages = await this.getMessagesFromTopic(topic.topicName);

    return {
      topicName: topic.topicName,
      totalPayloads: messages.length,
      payloads: messages,
    };
  }

  async deleteTopic(userId: string, topicId: string) {
    // Busca o tópico no banco de dados
    const topic = await this.topicModel.findOne({ _id: topicId, userId }).exec();
    if (!topic) {
      throw new Error('Tópico não encontrado ou você não tem permissão para apagá-lo');
    }
  
    const topicName = topic.topicName; // Obtém o nome do tópico
  
    // Conecta ao Kafka
    await this.admin.connect();
    try {
      // Apaga o tópico no Kafka usando o nome obtido
      await this.admin.deleteTopics({
        topics: [topicName],
      });
    } catch (error) {
      console.error('Erro ao deletar tópico no Kafka:', error);
      throw new Error('Falha ao deletar o tópico no Kafka');
    } finally {
      // Garante que o Kafka será desconectado
      await this.admin.disconnect();
    }
  
    // Apaga o registro do banco de dados usando o ID fornecido
    await this.topicModel.deleteOne({ _id: topicId }).exec();
  
    return {
      message: 'Tópico deletado com sucesso',
      topicId,
      topicName, // Incluí o nome do tópico para facilitar o debug
    };
  }
  

  private async getMessagesFromTopic(topic: string) {
    const messages = [];
    const consumer = this.kafka.consumer({ groupId: `${topic}-temporary-group-${Date.now()}` });

    await consumer.connect();

    try {
      await consumer.subscribe({ topic, fromBeginning: true });

      await consumer.run({
        eachMessage: async ({ message }) => {
          messages.push({
            key: message.key?.toString(),
            value: message.value?.toString(),
          });
        },
      });

      await new Promise((resolve) => setTimeout(resolve, 2000));

      await consumer.disconnect();

      return messages.map((msg) => JSON.parse(msg.value)); // Converter para JSON se necessário
    } catch (error) {
      console.error('Erro ao obter mensagens do tópico:', error);
      throw error;
    } finally {
      await consumer.disconnect();
    }
  }
}
