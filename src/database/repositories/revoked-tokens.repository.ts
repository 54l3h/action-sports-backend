import { Injectable } from '@nestjs/common';
import { BaseRepository } from '../base.repository';
import { RevokedToken, RevokedTokenType } from '../models';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class RevokedTokensRepository extends BaseRepository<RevokedTokenType> {
  constructor(
    @InjectModel(RevokedToken.name)
    private readonly revokedTokenModel: Model<RevokedTokenType>,
  ) {
    super(revokedTokenModel);
  }
}
