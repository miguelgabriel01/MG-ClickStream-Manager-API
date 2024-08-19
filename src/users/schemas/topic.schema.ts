// src/users/schemas/topic.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Topic extends Document {
  @Prop({ required: true })
  topicName: string;

  @Prop({ required: true })
  userId: string;
}

export const TopicSchema = SchemaFactory.createForClass(Topic);
