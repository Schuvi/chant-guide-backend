import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { newPaginate } from 'src/common/utils/newPagination.util';
import { CreateCategoriesDto } from 'src/dtos/categories/create-categories.dto';
import { UpdateCategoriesDto } from 'src/dtos/categories/update-categories.dto';
import { PaginatedResponseDto } from 'src/dtos/pagination/pagination-response.dto';
import { PaginationDto } from 'src/dtos/pagination/pagination.dto';
import { ICategories } from 'src/interfaces/categories/categories.interface';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectModel('categories') private categoriesModel: Model<ICategories>,
  ) {}

  async createCategory(
    categoriesDto: CreateCategoriesDto,
  ): Promise<ICategories> {
    return await new this.categoriesModel(categoriesDto).save();
  }

  async getAllCategories(
    paginationDto: PaginationDto,
  ): Promise<PaginatedResponseDto<ICategories>> {
    const query = {};
    const except = {};

    const categoriesData = await newPaginate<ICategories>(
      this.categoriesModel,
      query,
      except,
      paginationDto,
    );

    if (!categoriesData || categoriesData.data.length === 0) {
      throw new NotFoundException('No categories found');
    }

    return categoriesData;
  }

  async deleteCategories(categoryId: string): Promise<ICategories> {
    const deleteCategories =
      await this.categoriesModel.findByIdAndDelete(categoryId);

    if (!deleteCategories) {
      throw new NotFoundException(`Category with ID ${categoryId}`);
    }

    return deleteCategories;
  }

  async updateCategories(
    categoryId: string,
    updateCategoriesDto: UpdateCategoriesDto,
  ): Promise<ICategories> {
    const existingUser = await this.categoriesModel.findByIdAndUpdate(
      categoryId,
      updateCategoriesDto,
      {
        new: true,
      },
    );

    if (!existingUser) {
      throw new NotFoundException(`Category with ID ${categoryId} not found`);
    }

    return existingUser;
  }
}
