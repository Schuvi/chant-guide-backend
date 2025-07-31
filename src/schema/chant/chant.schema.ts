import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { User } from '../user/user.schema';
import { Categories } from '../categories/categories.schema';

@Schema({
  timestamps: true,
})
export class Chant {
  @Prop()
  title: string;

  @Prop({ type: Types.ObjectId, ref: User.name, required: true })
  authorId: string;

  @Prop({ type: Types.ObjectId, ref: Categories.name, required: true })
  categoryId: string;

  @Prop()
  videoUrl: string;

  @Prop({ default: 0 })
  views: number;
  
  @Prop()
  imageId: string;
  
  @Prop()
  image: string;

  @Prop()
  content: string;
}

export const ChantSchema = SchemaFactory.createForClass(Chant);
