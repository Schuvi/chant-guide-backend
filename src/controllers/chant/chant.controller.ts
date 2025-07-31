import {
  Controller,
  Body,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  Put,
  Res,
  Query,
} from '@nestjs/common';
import { ApiOperation, ApiTags, ApiQuery, ApiParam } from '@nestjs/swagger';
import { CreateChantDto } from 'src/dtos/chant/create-chant.dto';
import { UpdateChantDto } from 'src/dtos/chant/update-chant.dto';
import { PaginationDto } from 'src/dtos/pagination/pagination.dto';
import { ChantService } from 'src/services/chant/chant.service';

@ApiTags('Chants')
@Controller('chant')
export class ChantController {
  constructor(private readonly chantService: ChantService) {}

  @Get()
  @ApiOperation({ summary: 'Get all chant' })
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
  async getAllChant(@Query() paginationDto: PaginationDto, @Res() res: any) {
    try {
      const chantData = await this.chantService.getAllChants(paginationDto);
      return res.status(HttpStatus.OK).json({
        message: 'All chants retrieved successfully',
        chantData,
      });
    } catch (error) {
      if (error.status == 404) {
        return res.status(HttpStatus.NOT_FOUND).json({
          message: 'Error retrieving chants',
          error: error.message,
        });
      }

      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Error retrieving chants',
        error: error.message,
      });
    }
  }

  @Get(':chantId')
  @ApiOperation({ summary: 'Get Chant By Id' })
  async getChantById(@Param('chantId') chantId: string, @Res() res: any) {
    try {
      const chantData = await this.chantService.getChantById(chantId);
      return res.status(HttpStatus.OK).json({
        message: 'Chant retrieved successfully',
        data: chantData,
      });
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Error retrieving chant',
        error: error.message,
      });
    }
  }

  @Post(':authorId/:categoryId')
  @ApiOperation({ summary: 'Create new chant' })
  @ApiParam({
    name: 'authorId',
    required: true,
    type: String,
    description: 'Author for this chant',
  })
  @ApiParam({
    name: 'categoryId',
    required: true,
    type: String,
    description: 'Category for this chant',
  })
  async createNewChant(
    @Param('authorId') authorId: string,
    @Param('categoryId') categoryId: string,
    @Body() createChant: CreateChantDto,
    @Res() res: any,
  ) {
    try {
      if (!categoryId || !authorId) {
        return res.status(HttpStatus.BAD_REQUEST).json({
          message: 'Category Id dan Author Id is required',
        });
      }

      await this.chantService.createChant(createChant, authorId, categoryId);

      return res.status(HttpStatus.CREATED).json({
        message: 'Chant created successfly',
      });
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Error creating chant',
        error: error,
      });
    }
  }

  @Put(':chantId')
  @ApiOperation({ summary: 'Edit chant by id' })
  async updateChant(
    @Param('chantId') chantId: string,
    @Body() updateChantDto: UpdateChantDto,
    @Res() res: any,
  ) {
    try {
      await this.chantService.updateChant(chantId, updateChantDto);
      return res.status(HttpStatus.OK).json({
        message: 'Chant updated successfully',
      });
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Error updating chant',
        error: error.message,
      });
    }
  }

  @Delete(':chantId')
  @ApiOperation({ summary: 'Delete chant by ID' })
  async deleteChant(@Param('chantId') chantId: string, @Res() res: any) {
    try {
      await this.chantService.deleteChant(chantId);
      return res.status(HttpStatus.OK).json({
        message: 'Chant deleted successfully',
      });
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Error deleting chant',
        error: error.message,
      });
    }
  }
}
