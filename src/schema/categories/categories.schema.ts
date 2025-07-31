import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

@Schema()
export class Categories {
  @Prop()
  categories_name: string;

  @Prop()
  slug: string;
}

export const CategoriesSchema = SchemaFactory.createForClass(Categories);
