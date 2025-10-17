import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Req,
  Request,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { Auth } from '../common/decorators';
import { RolesEnum } from '../common/types';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadFileOptions } from '../common/utils';
import { ImageAllowedExtensions } from '../common/constants';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post('create')
  @Auth(RolesEnum.ADMIN)
  @UseInterceptors(
    FileInterceptor(
      'image',
      UploadFileOptions({
        path: 'category',
        allowFileTypes: ImageAllowedExtensions,
      }),
    ),
  )
  async createCategory(
    @Req() req: Request,
    @Body() dto: CreateCategoryDto,
    @UploadedFile() image?: Express.Multer.File,
  ) {
    const userId = req['user'].id;
    return this.categoryService.createCategory(userId, dto, image);
  }

  @Put('update/:categoryId')
  @Auth(RolesEnum.ADMIN)
  @UseInterceptors(
    FileInterceptor(
      'image',
      UploadFileOptions({
        path: 'category',
        allowFileTypes: ImageAllowedExtensions,
      }),
    ),
  )
  async updateCategory(
    @Req() req: Request,
    @Body() dto,
    @Param('categoryId') categoryId: number,
    @UploadedFile() image?: Express.Multer.File,
  ) {
    const userId = req['user'].id;
    return this.categoryService.updateCategory(categoryId, userId, dto, image);
  }

  @Get('/:categoryId')
  async getCategoryById(@Param('categoryId') categoryId: string) {
    return this.categoryService.getCategoryById(categoryId);
  }

  @Delete('/:categoryId')
  async deleteCategoryById(@Param('categoryId') categoryId: string) {
    return this.categoryService.deleteCategoryById(categoryId);
  }
}
