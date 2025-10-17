import { Injectable } from '@nestjs/common';
import { BaseRepository } from '../base.repository';
import { Brand, BrandType } from '../models';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class BrandRepository extends BaseRepository<BrandType> {
  constructor(
    @InjectModel(Brand.name) private readonly brandModel: Model<BrandType>,
  ) {
    super(brandModel);
  }
}
