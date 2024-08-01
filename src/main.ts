import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,  // Remove propriedades que não estão no DTO
    forbidNonWhitelisted: true, // Retorna erro se propriedades extras forem encontradas
    transform: true, // Transforma payloads para DTO automaticamente
  }));
  await app.listen(3000);
}
bootstrap();