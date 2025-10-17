import { Injectable } from '@nestjs/common';
import { BaseRepository } from '../base.repository';
import { InjectModel } from '@nestjs/mongoose';
import { Otp, OtpType } from '../models';
import { Model, Types } from 'mongoose';
import { OtpEnum } from 'src/common/types';
import { hash } from 'src/common/security';

interface ICreateOptions {
  userId: Types.ObjectId;
  otp: string;
  otpType: OtpEnum;
  expiryTime?: Date;
}

@Injectable()
export class OtpRepository extends BaseRepository<OtpType> {
  constructor(
    @InjectModel(Otp.name) private readonly otpModel: Model<OtpType>,
  ) {
    super(otpModel);
  }

  async createOtp({ userId, otp, otpType, expiryTime }: ICreateOptions) {
    return await this.otpModel.create({
      otp: await hash(otp),
      otpType,
      userId,
    });
  }

  async findConfirmationOtpByUserId(userId) {
    return this.otpModel
      .findOne({ userId, otpType: OtpEnum.CONFIRMATION })
      .sort({ createdAt: -1 });
  }

  async findByIdAndDelete(documentId) {
    return this.otpModel.findByIdAndDelete(documentId);
  }
}
