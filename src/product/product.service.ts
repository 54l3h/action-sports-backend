import { Injectable } from '@nestjs/common';
import { ProductRepository } from 'src/database/repositories';

@Injectable()
export class ProductService {
  constructor(private readonly productRepository: ProductRepository) {}

  async createProduct(images, dto) {
    const product = await this.productRepository.create({});
  }
}
