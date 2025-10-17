import { Module } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';
import { CategoryRepository } from 'src/database/repositories';
import { CategoryModel } from 'src/database/models';
import { UploadService } from 'src/common/services/upload.service';

@Module({
  controllers: [CategoryController],
  providers: [CategoryService, UploadService, CategoryRepository],
  imports: [CategoryModel],
})
export class CategoryModule {}
