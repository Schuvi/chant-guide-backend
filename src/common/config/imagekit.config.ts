// src/imagekit/imagekit.config.ts (contoh file baru untuk konfigurasi)
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import ImageKit = require('imagekit');

@Injectable()
export class ImageKitConfig {
  public imagekitInstance: ImageKit;

  constructor(private configService: ConfigService) {
    this.imagekitInstance = new ImageKit({
      publicKey: this.configService.get<string>('IMAGEKIT_PUBLIC_KEY') ?? '',
      privateKey: this.configService.get<string>('IMAGEKIT_PRIVATE_KEY') ?? '',
      urlEndpoint: this.configService.get<string>('IMAGEKIT_URL_ENDPOINT')?? '',
    });
  }
}