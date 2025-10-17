import { Injectable } from '@nestjs/common';
import { BaseRepository } from '../base.repository';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product, ProductType } from '../models/product.model';

@Injectable()
export class ProductRepository extends BaseRepository<ProductType> {
  constructor(
    @InjectModel(Product.name) private readonly productModel: Model<ProductType>,
  ) {
    super(productModel);
  }
}
