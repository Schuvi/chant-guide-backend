import { Document } from "mongoose";
export interface ICategories extends Document {
    categories_name: string;
    slug: string
}