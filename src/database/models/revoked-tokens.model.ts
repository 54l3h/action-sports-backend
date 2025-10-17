// schema class

import { MongooseModule, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, HydratedDocument, Types } from 'mongoose';
import { User } from './user.model';

@Schema({ timestamps: true })
export class RevokedToken {
  @Prop({ required: true, type: String })
  tokenId: string;

  @Prop({ type: Types.ObjectId, ref: User.name, required: true })
  userId: Types.ObjectId | string;

  @Prop({ type: Date, required: true })
  expiryDate: Date;
}

// actual schema

export const RevokedTokenSchema = SchemaFactory.createForClass(RevokedToken);

// model

export const RevokedTokenModel = MongooseModule.forFeature([
  { name: RevokedToken.name, schema: RevokedTokenSchema },
]);

// type

export type RevokedTokenType = HydratedDocument<RevokedToken> & Document;

export type SessionInfo = {
  tokenId: string;
  userId: string;
  expiryDate: Date;
};
