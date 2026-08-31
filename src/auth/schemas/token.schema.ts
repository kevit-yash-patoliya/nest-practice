import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type TokenDocument = HydratedDocument<Token>;

@Schema({ timestamps: { createdAt: true, updatedAt: false } })
export class Token {
  @Prop({ required: true, index: true })
  token: string;

  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  userId: mongoose.Types.ObjectId;
}

export const TokenSchema = SchemaFactory.createForClass(Token);
