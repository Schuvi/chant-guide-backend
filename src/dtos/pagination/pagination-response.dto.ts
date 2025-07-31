import { Type } from 'class-transformer';

// Generic DTO untuk paginated response
export class PaginatedResponseDto<T> {
  data: T[];
  totalItems: number;
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;

  constructor(
    data: T[],
    totalItems: number,
    currentPage: number,
    itemsPerPage: number,
  ) {
    this.data = data;
    this.totalItems = totalItems;
    this.currentPage = currentPage;
    this.itemsPerPage = itemsPerPage;
    this.totalPages = Math.ceil(totalItems / itemsPerPage);
  }
}
