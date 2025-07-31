import { IsOptional, IsInt, Min, Max, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class PaginationDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 10;

  @IsOptional()
  @Type(() => String)
  search?: string;

  @IsOptional()
  @Type(() => String)
  searchField?: string;

  // @ApiProperty({
  //   required: false,
  //   type: [String],
  //   description:
  //     'Comma-separated list of relations to include (e.g., "author,category")',
  //   example: 'author,category',
  // })
  // @IsOptional()
  // @IsString()
  // relations?: string;
}
