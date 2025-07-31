import { Injectable } from '@nestjs/common';
import { ImageKitConfig } from 'src/common/config/imagekit.config';

@Injectable()
export class ImageService {
  constructor(private readonly imageKitConfig: ImageKitConfig) {}

  async uploadImage(file: Buffer) {
    const response = await this.imageKitConfig.imagekitInstance.upload({
      file: file,
      fileName: 'chant',
      folder: '/chant',
      useUniqueFileName: true,
    });

    if (response != null) {
      return {
        imageUrl: response.url,
        fileId: response.fileId,
      };
    }
  }

  async deleteImage(fileId: string) {
    await this.imageKitConfig.imagekitInstance.deleteFile(fileId);
  }
}
