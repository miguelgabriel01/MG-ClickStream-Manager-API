// app.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.DATABASE_URL),
    UsersModule,
  ],
})
export class AppModule {}

/*ConfigModule.forRoot(): Carrega as variáveis de ambiente do arquivo .env.
MongooseModule.forRoot(): Conecta ao MongoDB usando a URL de conexão fornecida nas variáveis de ambiente.*/