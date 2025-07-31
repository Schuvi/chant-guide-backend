import {
  Controller,
  Delete,
  FileTypeValidator,
  HttpStatus,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  Post,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiParam,
} from '@nestjs/swagger';
import { ImageService } from 'src/services/image/image.service';

@Controller('image')
export class ImageController {
  constructor(private readonly imageServices: ImageService) {}

  @Post('upload')
  @ApiOperation({ summary: 'Upload image to imagekit' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: 'Image file to upload (JPEG, PNG, WEBP, max 2MB)',
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('file'))
  async uploadFileImage(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({
            maxSize: 1 * 1024 * 1024,
            message: 'File size should not exceed 1 MB',
          }),
          new FileTypeValidator({ fileType: 'image/(jpeg|png|webp)' }),
        ],
      }),
    )
    file: Express.Multer.File,
    @Res() res: any,
  ) {
    try {
      const fileBuffer = file.buffer;

      const response = await this.imageServices.uploadImage(fileBuffer);

      if (response != null) {
        return res.status(HttpStatus.OK).json({
          message: 'Image uploaded successfully',
          data: response,
        });
      }
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Error uploading image',
        error: error.message,
      });
    }
  }

  @Delete('delete/:fileId')
  @ApiOperation({ summary: 'Delete image in imagekit' })
  @ApiParam({
    name: 'fileId',
    required: true,
    description: 'File id for delete image',
    type: String,
  })
  async deleteImageKit(@Param('fileId') fileId: string, @Res() res: any) {
    try {
      await this.imageServices.deleteImage(fileId);

      return res.status(HttpStatus.OK).json({
        message: 'Image deleted successfully',
      });
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Error deleting image',
        error: error.message,
      });
    }
  }
}
