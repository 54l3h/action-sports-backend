import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { ProductRepository } from '../database/repositories';
import { ProductModel } from '../database/models';

@Module({
  controllers: [ProductController],
  providers: [ProductService, ProductRepository],
  imports: [ProductModel],
})
export class ProductModule {}
