import { MongooseModule, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, HydratedDocument, Types } from 'mongoose';
import { OtpEnum } from '../../common/types';
import { User } from './user.model';

// Class schema
@Schema({ timestamps: true })
export class Otp {
  @Prop({ type: String, required: true })
  otp: string;

  @Prop({ type: Types.ObjectId, ref: User.name, required: true })
  userId: Types.ObjectId;

  @Prop({ type: String, required: true, enum: Object.values(OtpEnum) })
  otpType: string;
}

// Actual Schama
export const OtpSchema = SchemaFactory.createForClass(Otp);
OtpSchema.index({ createdAt: -1 }, { expireAfterSeconds: 600 });

// Model
export const OtpModel = MongooseModule.forFeature([
  { name: Otp.name, schema: OtpSchema },
]);

// Type

export type OtpType = HydratedDocument<Otp> & Document;
