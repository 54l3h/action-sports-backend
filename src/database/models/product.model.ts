import { MongooseModule, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, HydratedDocument, Types } from 'mongoose';
import { User } from './user.model';
import slugify from 'slugify';
import { Category } from './category.model';
import { SubCategory } from './sub-category.model';
import { Brand } from './brand.model';

// Class schema
@Schema({ timestamps: true })
export class Product {
  @Prop({
    type: String,
    required: true,
    lowercase: true,
    trim: true,
    index: { name: 'product_name_unique_idx' },
  })
  name: string;

  @Prop({
    type: String,
    default: function () {
      return slugify(this.name, '-');
    },
    index: { name: 'product_slug_idx' },
  })
  slug: string;

  @Prop({ type: String, required: true, lowercase: true, trim: true })
  description: string;

  @Prop({
    type: [
      {
        secure_url: { type: String, required: true },
        public_id: { type: String, required: true, unique: true },
      },
    ],
    _id: false,
    default: [],
  })
  images: { secure_url: string; public_id: string }[];

  @Prop({ type: Types.ObjectId, ref: User.name, required: true })
  createdBy: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: User.name })
  updatedBy?: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: Category.name, required: true })
  categoryId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: SubCategory.name, required: true })
  subCategoryId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: Brand.name, required: true })
  brandId: Types.ObjectId;

  @Prop({ type: Number, required: true })
  amount: number;

  @Prop({ type: Number, required: true })
  basePrice: number;

  @Prop({ type: Number, default: 0 })
  discount: number;

  @Prop({
    type: Number,
    default: function () {
      return this.basePrice - this.basePrice * (this.discount || 0 / 100);
    },
  })
  finalPrice: number;

  @Prop({ type: Number, required: true, min: 1 })
  stock: number;

  overallRating: number;
}

// Actual schema

const ProductSchema = SchemaFactory.createForClass(Product);

// Model

export const ProductModel = MongooseModule.forFeature([
  { name: Product.name, schema: ProductSchema },
]);

// Type

export type ProductType = HydratedDocument<Product> & Document;
