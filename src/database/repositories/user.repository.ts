import { Injectable } from '@nestjs/common';
import { BaseRepository } from '../base.repository';
import { User, UserType } from '../models/user.model';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

@Injectable()
export class UserRepository extends BaseRepository<UserType> {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserType>,
  ) {
    super(userModel);
  }

  async findByEmail(email: string) {
    return this.findOne({ filters: { email } });
  }

  async updateEmailConfirmed(userId: string) {
    return await this.userModel.findOneAndUpdate(
      { _id: userId },
      { verifiedAt: new Date() },
      { new: true },
    );
  }

  async findById(id: string) {
    return this.userModel.findById(id);
  }
}
