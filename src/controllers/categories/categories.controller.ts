import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  Res,
} from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { CreateCategoriesDto } from 'src/dtos/categories/create-categories.dto';
import { UpdateCategoriesDto } from 'src/dtos/categories/update-categories.dto';
import { PaginationDto } from 'src/dtos/pagination/pagination.dto';
import { CategoriesService } from 'src/services/categories/categories.service';

@ApiTags('Categories')
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  @ApiOperation({ summary: 'Get all category' })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Current page number',
    default: 1,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Number of items per page',
    default: 10,
  })
  @ApiQuery({
    name: 'search',
    required: false,
    type: String,
    description: 'Search term for filtering',
  })
  @ApiQuery({
    name: 'searchField',
    required: false,
    type: String,
    description: 'Field to search on (e.g., "title", "content")',
  })
  async getAllCategory(@Query() paginationDto: PaginationDto, @Res() res: any) {
    try {
      const categoriesData =
        await this.categoriesService.getAllCategories(paginationDto);
      return res.status(HttpStatus.OK).json({
        message: 'All category retrieved successfully',
        categoriesData,
      });
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Error retrieving category',
        error: error.message,
      });
    }
  }

  @Post()
  @ApiOperation({ summary: 'Create new category' })
  async createNewCategory(
    @Body() createCategoryDto: CreateCategoriesDto,
    @Res() res: any,
  ) {
    try {
      await this.categoriesService.createCategory(createCategoryDto);

      return res.status(HttpStatus.CREATED).json({
        message: 'Category created successfully',
      });
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Error creating category',
        error: error.message,
      });
    }
  }

  @Put(':categoryId')
  @ApiOperation({ summary: 'Update category by ID' })
  async updateCategory(
    @Param('categoryId') categoryId: string,
    @Body() updateCategoryDto: UpdateCategoriesDto,
    @Res() res: any,
  ) {
    try {
      await this.categoriesService.updateCategories(
        categoryId,
        updateCategoryDto,
      );

      return res.status(HttpStatus.OK).json({
        message: 'Category updated successfully',
      });
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Error updating category',
        error: error.message,
      });
    }
  }

  @Delete(':categoryId')
  @ApiOperation({ summary: 'Delete category by ID' })
  async deleteCategory(@Param('categoryId') categoryId: string, @Res() res: any) {
    try {
      await this.categoriesService.deleteCategories(categoryId);

      return res.status(HttpStatus.OK).json({
        message: 'Category deleted successfully',
      });
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Error deleting category',
        error: error.message,
      });
    }
  }
}
