import { Document, Types } from 'mongoose';
import { IUser } from '../user/user.interface';
import { ICategories } from '../categories/categories.interface';

export interface IChant extends Document {
  title: string;
  authorId: Types.ObjectId;
  categoryId: Types.ObjectId;
  videoUrl: string;
  views: string;
  content: string;
  imageId: string;
  image: string;
  createdAt: Date;
  updatedAt: Date;
  author: IUser;
  category: ICategories;
}