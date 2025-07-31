// new-paginate-aggregate.ts (create a new file)
import { Model, Document, Aggregate, PipelineStage } from 'mongoose';
import { PaginationDto } from 'src/dtos/pagination/pagination.dto';
import { PaginatedResponseDto } from 'src/dtos/pagination/pagination-response.dto';

export async function paginateAggregate<T>( // T here is the shape of the aggregated document
  model: Model<Document>, // Model is used for countDocuments and initial aggregate call
  pipeline: PipelineStage[], // The aggregation pipeline
  paginationDto: PaginationDto,
): Promise<PaginatedResponseDto<T>> {
  const page = paginationDto.page ?? 1;
  const limit = paginationDto.limit ?? 10;
  const skip = (page - 1) * limit;

  // Clone the pipeline to add pagination stages without modifying the original
  const paginatedPipeline = [...pipeline];

  // Add search stage if applicable (adjust based on your aggregation search needs)
  if (paginationDto.search && paginationDto.searchField) {
    if (
      typeof paginationDto.searchField === 'string' &&
      paginationDto.searchField.length > 0
    ) {
      // For simple text search on a single field in aggregation
      paginatedPipeline.push({
        $match: {
          [paginationDto.searchField]: {
            $regex: paginationDto.search,
            $options: 'i',
          },
        },
      });
    } else {
      console.warn(
        'Invalid searchField for aggregation provided in paginationDto.',
      );
    }
  }

  const countPipeline = [...paginatedPipeline]; // Use the pipeline with search and lookups
  countPipeline.push({ $count: 'totalItems' }); // Add $count stage

  // --- Data Fetch Pipeline ---
  // Add pagination stages to the paginatedPipeline
  paginatedPipeline.push({ $skip: skip }, { $limit: limit });

  const [data, totalCountResult] = await Promise.all([
    model.aggregate(paginatedPipeline).exec(),
    model.aggregate(countPipeline).exec(),
  ]);

  const totalItems =
    totalCountResult.length > 0 ? totalCountResult[0].totalItems : 0;

  return new PaginatedResponseDto<T>(
    data as Array<T>, // Data from aggregation is already plain objects
    totalItems,
    page,
    limit,
  );
}
