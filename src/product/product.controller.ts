import {
  Body,
  Controller,
  Post,
  Req,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { Auth } from '../common/decorators';
import { RolesEnum } from '../common/types';
import { FilesInterceptor } from '@nestjs/platform-express';
import { UploadFileOptions } from '../common/utils';
import { ImageAllowedExtensions } from '../common/constants';
import type { Request } from 'express';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post('create')
  @Auth(RolesEnum.ADMIN)
  @UseInterceptors(
    FilesInterceptor(
      'images',
      4,
      UploadFileOptions({
        path: 'product',
        allowFileTypes: ImageAllowedExtensions,
      }),
    ),
  )
  async createProduct(
    @Req() req: Request,
    @UploadedFiles() images: Express.Multer.File[],
    @Body() dto,
  ) {
    dto.userId = req['user'].id;
    return await this.productService.createProduct(images, dto);
  }
}
