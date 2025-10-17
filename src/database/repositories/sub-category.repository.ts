import { Injectable } from '@nestjs/common';
import { BaseRepository } from '../base.repository';
import { SubCategory, SubCategoryType } from '../models';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class SubCategoryRepository extends BaseRepository<SubCategoryType> {
  constructor(
    @InjectModel(SubCategory.name)
    private readonly subCategoryModel: Model<SubCategoryType>,
  ) {
    super(subCategoryModel);
  }
}
