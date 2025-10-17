import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Types } from 'mongoose';
import slugify from 'slugify';
import { UploadService } from 'src/common/services/upload.service';
import { CategoryRepository } from 'src/database/repositories';

@Injectable()
export class CategoryService {
  constructor(
    private readonly categoryRepository: CategoryRepository,
    private readonly uploadService: UploadService,
  ) {}

  async createCategory(userId, dto, image?) {
    const checkCategoryName = await this.categoryRepository.findOne({
      filters: { name: dto.categoryName },
    });

    if (checkCategoryName) {
      throw new BadRequestException('Category already exists');
    }

    const category = {
      name: dto.categoryName,
      createdBy: userId,
    };

    if (image) {
      const imageResult = await this.uploadService.uploadFile(image.path, {
        folder: `${process.env.CLOUDINARY_FOLDER}/category/${dto.categoryName}`,
      });
      category['image'] = imageResult;
    }

    return await this.categoryRepository.create(category);
  }

  async updateCategory(categoryId, userId, dto, image?) {
    const category = await this.getCategoryById(categoryId);

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    // Based on the business
    // if (!category.createdBy.equals(userId)) {
    //   throw new UnauthorizedException(
    //     'Only the category creator can update this category',
    //   );
    // }

    if (image) {
      await this.uploadService.deleteFileByPublicId(category.image.public_id);
      const categoryImage = await this.uploadService.uploadFile(image.path, {
        folder: `${process.env.CLOUDINARY_FOLDER}/category/${dto.categoryName}`,
      });
      category.image = categoryImage;
    }

    if (dto.categoryName) {
      const isThisNameAlreadyUsed = await this.categoryRepository.findOne({
        filters: {
          name: dto.categoryName,
        },
      });

      if (isThisNameAlreadyUsed) {
        throw new BadRequestException(
          "You can not use this name becauese it\'s already used",
        );
      }

      category.name = dto.categoryName;
      category.slug = slugify(category.name, '-');
    }

    category.updatedBy = userId;
    await category.save();
    return category;
  }

  async getCategoryById(categoryId: string) {
    return await this.categoryRepository.findOne({
      filters: {
        _id: categoryId,
      },
    });
  }

  async deleteCategoryById(categoryId: string) {}
}
