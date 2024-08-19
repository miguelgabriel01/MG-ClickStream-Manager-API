//configurações gerais
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

//relacionado a criação de usuarios
import { UsersService } from './users.service'; // Serviço existente para usuários
import { UsersController } from './users.controller'; // Controlador existente para usuários
import { User, UserSchema } from './schemas/user.schema'; // Esquema existente para usuários

//relacionado a criação de topicos
import { KafkaService } from './kafka.service'; // Novo serviço para Kafka
import { TopicsController } from './topics.controller'; // Novo controlador para tópicos
import { Topic, TopicSchema } from './schemas/topic.schema'; // Novo esquema para tópicos

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]), // Importação do esquema de usuário
    MongooseModule.forFeature([{ name: Topic.name, schema: TopicSchema }]) // Importação do esquema de tópicos
  ],
  providers: [
    UsersService, // Serviço existente para usuários
    KafkaService // Novo serviço para Kafka
  ],
  controllers: [
    UsersController, // Controlador existente para usuários
    TopicsController // Novo controlador para tópicos
  ],
  exports: [UsersService] // Exporta o serviço de usuários para outros módulos
})
export class UsersModule {}
