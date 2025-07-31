import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreateChantDto } from 'src/dtos/chant/create-chant.dto';
import { UpdateChantDto } from 'src/dtos/chant/update-chant.dto';
import { IChant } from 'src/interfaces/chant/chant.interface';
import {
  Model,
  ProjectionType,
  RootFilterQuery,
  Types,
} from 'mongoose';
import { PaginationDto } from 'src/dtos/pagination/pagination.dto';
import { PaginatedResponseDto } from 'src/dtos/pagination/pagination-response.dto';
import { paginateAggregate } from 'src/common/utils/AggregatePagination.util';

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
    const query: RootFilterQuery<IChant> = {};
    const except: ProjectionType<IChant> = {
      content: 0,
      __v: 0,
      videoUrl: 0,
      imageId: 0,
      createdAt: 0,
      updatedAt: 0,
      categoryId: 0,
    };

    const chantData = await paginateAggregate<IChant>(
      this.chantModel,
      [
        {
          $lookup: {
            from: 'categories',
            localField: 'categoryId',
            foreignField: '_id',
            as: 'category',
          },
        },
      ],
      paginationDto,
    );

    return chantData;
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
