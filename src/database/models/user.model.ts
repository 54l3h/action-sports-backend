import { MongooseModule, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { encrypt } from 'src/common/security/encryption.security';
import { hash } from 'src/common/security/hash.security';
import { GenderEnum, RolesEnum } from 'src/common/types';

// create class schema
@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, type: String, lowercase: true, trim: true })
  firstName: string;

  @Prop({ required: true, type: String, lowercase: true, trim: true })
  lastName: string;

  @Prop({
    required: true,
    type: String,
    lowercase: true,
    trim: true,
    unique: true,
  })
  email: string;

  @Prop({
    required: true,
    type: String,
    lowercase: true,
    trim: true,
    enum: Object.values(GenderEnum),
  })
  gender: string;

  @Prop({
    required: true,
    type: String,
  })
  password: string;

  @Prop({
    required: true,
    unique: true,
    type: String,
  })
  phone: string;

  @Prop({ type: Date, default: null })
  verifiedAt: Date;

  @Prop({
    type: String,
    enum: Object.values(RolesEnum),
    lowercase: true,
    trim: true,
    default: RolesEnum.NORMAL_USER,
  })
  role: string;

  @Prop({ type: Date, default: null })
  deletedAt: Date;
}

// create actual schema
export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await hash(this.password);
  }

  if (this.isModified('phone')) {
    this.phone = encrypt(this.phone);
  }

  next();
});

// create model
export const UserModel = MongooseModule.forFeature([
  { name: User.name, schema: UserSchema },
]);

// export type
export type UserType = HydratedDocument<User>;
