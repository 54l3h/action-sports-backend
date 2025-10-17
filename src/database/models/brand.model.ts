// class schema

import { MongooseModule, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { SubCategory } from './sub-category.model';
import slugify from 'slugify';

@Schema()
export class Brand {
  @Prop({ type: Types.ObjectId, required: true, ref: SubCategory.name })
  subCatgeoryId: Types.ObjectId | string;

  @Prop({
    type: String,
    required: true,
    lowercase: true,
    trim: true,
    index: { name: 'brand_name_unique_idx', unique: true },
  })
  name: string;

  @Prop({
    type: String,
    default: function () {
      return slugify(this.name, '-');
    },
    index: { name: 'brand_slug_idx' },
  })
  slug: string;
}

// actual schema

export const BrandSchema = SchemaFactory.createForClass(Brand);

// model

export const BrandModel = MongooseModule.forFeature([
  { name: Brand.name, schema: BrandSchema },
]);

// type
export type BrandType = HydratedDocument<Brand> & Document;
