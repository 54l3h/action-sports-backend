import { Injectable } from '@nestjs/common';
import { ProductRepository } from '../database/repositories';

@Injectable()
export class ProductService {
  constructor(private readonly productRepository: ProductRepository) {}

  async createProduct(images, dto) {
    const product = await this.productRepository.create({});
  }
}
