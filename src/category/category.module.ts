import { Module } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';
import { CategoryRepository } from '../database/repositories';
import { CategoryModel } from '../database/models';
import { UploadService } from '../common/services/upload.service';

@Module({
  controllers: [CategoryController],
  providers: [CategoryService, UploadService, CategoryRepository],
  imports: [CategoryModel],
})
export class CategoryModule {}
