// src/kafka.config.ts
import { KafkaClient, Producer } from 'kafka-node';

export const kafkaClient = new KafkaClient({ kafkaHost: 'localhost:29092' });

export const producer = new Producer(kafkaClient);

producer.on('ready', () => {
  console.log('Kafka Producer está pronto');
});

producer.on('error', (err) => {
  console.error('Erro no Kafka Producer:', err);
});
