import { Model } from 'mongoose';
import { BaseRepository } from '../base.repository';
import { Category, CategoryType, UserType } from '../models';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class CategoryRepository extends BaseRepository<CategoryType> {
  constructor(
    @InjectModel(Category.name)
    private readonly categoryModel: Model<CategoryType>,
  ) {
    super(categoryModel);
  }
}
