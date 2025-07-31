import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreateChantDto } from 'src/dtos/chant/create-chant.dto';
import { UpdateChantDto } from 'src/dtos/chant/update-chant.dto';
import { IChant } from 'src/interfaces/chant/chant.interface';
import { Model, Types } from 'mongoose';
import { PaginationDto } from 'src/dtos/pagination/pagination.dto';
import { PaginatedResponseDto } from 'src/dtos/pagination/pagination-response.dto';
import { paginate, PopulateConfig } from 'src/common/utils/pagination.util';
import { User } from 'src/schema/user/user.schema';
import { Chant } from 'src/schema/chant/chant.schema';
import { Categories } from 'src/schema/categories/categories.schema';

@Injectable()
export class ChantService {
  constructor(@InjectModel('chant') private chantModel: Model<IChant>) {}

  async createChant(
    createChantDto: CreateChantDto,
    authorId: string,
    categoryId: string,
  ): Promise<IChant> {
    const newChant = await new this.chantModel({
      authorId: new Types.ObjectId(authorId),
      categoryId: new Types.ObjectId(categoryId),
      views: 0,
      ...createChantDto,
    });
    return newChant.save();
  }

  async getAllChants(
    paginationDto: PaginationDto,
  ): Promise<PaginatedResponseDto<IChant>> {
    const query = {};
    const except = {
      content: 0,
      __v: 0,
      videoUrl: 0,
      imageId: 0,
      createdAt: 0,
      updatedAt: 0,
    };

    const populateConfigs: PopulateConfig[] = [];

    const relationsFromDto = paginationDto.relations
      ? paginationDto.relations
          .split(',')
          .map((rel) => rel.trim().toLowerCase())
      : [];

    if (relationsFromDto.includes('author')) {
      populateConfigs.push({
        path: 'authorId',
        select: 'name', // Pilih field yang diinginkan dari model User
        model: User.name, // Nama model Mongoose
        as: 'author', // Ubah nama field di output dari authorId menjadi author
      });
    }

    if (relationsFromDto.includes('category')) {
      populateConfigs.push({
        path: 'categoryId',
        select: 'categories_name', // Pilih field yang diinginkan dari model Category
        model: Categories.name, // Nama model Mongoose
        as: 'category', // Ubah nama field di output dari categoryId menjadi category
      });
    }

    const chantData = await paginate<IChant>(
      this.chantModel,
      paginationDto,
      query,
      except,
      populateConfigs,
    );

    const dataAsIChant = chantData.data as IChant[];

    if (!chantData || chantData.data.length === 0) {
      throw new NotFoundException('No chant found');
    }

    return new PaginatedResponseDto<IChant>(
      dataAsIChant,
      chantData.totalItems,
      chantData.currentPage,
      chantData.itemsPerPage,
    );
  }

  async getChantById(chantId: string): Promise<IChant> {
    const existingChant = await this.chantModel.findById(chantId).exec();

    if (!existingChant) {
      throw new NotFoundException(`Chant with ID ${chantId} not found`);
    }

    return existingChant;
  }

  async deleteChant(chantId: string): Promise<IChant> {
    const deleteChant = await this.chantModel.findByIdAndDelete(chantId).exec();

    if (!deleteChant) {
      throw new NotFoundException(`Chant with ID ${chantId} not found`);
    }

    return deleteChant;
  }

  async updateChant(
    chantId: string,
    updateChantDto: UpdateChantDto,
  ): Promise<IChant> {
    const existingChant = await this.chantModel.findByIdAndUpdate(
      chantId,
      updateChantDto,
      {
        new: true,
      },
    );

    if (!existingChant) {
      throw new NotFoundException(`Chant with ID ${chantId} not found`);
    }

    return existingChant;
  }
}
