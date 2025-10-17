import { MongooseModule, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, HydratedDocument, Types } from 'mongoose';
import { User } from './user.model';
import slugify from 'slugify';
import { Category } from './category.model';

// Class Schema
@Schema({})
export class SubCategory {
  @Prop({
    type: String,
    required: true,
    lowercase: true,
    trim: true,
    index: { name: 'sub_category_name_unique_idx', unique: true },
  })
  name: string;

  @Prop({
    type: String,
    default: function () {
      return slugify(this.name, '-');
    },
    index: { name: 'sub_category_slug_idx' },
  })
  slug: string;

  @Prop({ type: Types.ObjectId, ref: Category.name, required: true })
  categoryId: Types.ObjectId | string;

  @Prop({ type: Types.ObjectId, ref: User.name, required: true })
  createdBy: Types.ObjectId | string;

  @Prop({ type: Object })
  image: object;
}

// Actual Schema
const SubCategorySchema = SchemaFactory.createForClass(SubCategory);

// Model
const SubCategoryModel = MongooseModule.forFeature([
  { name: SubCategory.name, schema: SubCategorySchema },
]);

// Type
export type SubCategoryType = HydratedDocument<SubCategory> & Document;
