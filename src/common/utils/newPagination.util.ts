import { Model, Document, ProjectionType, RootFilterQuery } from 'mongoose';
import { PaginationDto } from 'src/dtos/pagination/pagination.dto';
import { PaginatedResponseDto } from 'src/dtos/pagination/pagination-response.dto';

export async function newPaginate<T extends Document>(
  model: Model<T>,
  query: RootFilterQuery<T>,
  projection: ProjectionType<T>,
  paginationDto: PaginationDto,
): Promise<PaginatedResponseDto<T>> {
  const page = paginationDto.page ?? 1;
  const limit = paginationDto.limit ?? 10;
  const skip = (page - 1) * limit;

  const finalQuery = { ...query };

  if (paginationDto.search && paginationDto.searchField) {
    if (
      typeof paginationDto.searchField === 'string' &&
      paginationDto.searchField.length > 0
    ) {
      finalQuery[paginationDto.searchField] = {
        $regex: paginationDto.search,
        $options: 'i',
      };
    } else {
      console.warn('Invalid searchField provided in paginationDto.');
    }
  }

  const mongooseQuery = model
    .find(finalQuery, projection)
    .skip(skip)
    .limit(limit)
    .exec();

  const modelDataLength = model.countDocuments(finalQuery).exec();

  const [data, totalItems] = await Promise.all([
    mongooseQuery,
    modelDataLength,
  ]);

  return new PaginatedResponseDto<T>(data as Array<T>, totalItems, page, limit);
}
