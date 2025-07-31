import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from './schema/user/user.schema';
import { UserService } from './services/user/user.service';
import { UserController } from './controllers/user/user.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ChantService } from './services/chant/chant.service';
import { ChantController } from './controllers/chant/chant.controller';
import { ChantSchema } from './schema/chant/chant.schema';
import { CategoriesSchema } from './schema/categories/categories.schema';
import { CategoriesService } from './services/categories/categories.service';
import { CategoriesController } from './controllers/categories/categories.controller';
import { ImageService } from './services/image/image.service';
import { ImageController } from './controllers/image/image.controller';
import { ImageKitConfig } from './common/config/imagekit.config';
import { CsrfController } from './controllers/csrf/csrf.controller';
import { ThrottlerModule } from '@nestjs/throttler';
import mongoose from 'mongoose';
mongoose.set('debug', true)

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_CONNECTION_STRING'),
        dbName: 'ChantGuide',
      }),
      inject: [ConfigService],
    }),
    MongooseModule.forFeature([
      { name: 'user', schema: UserSchema },
      { name: 'chant', schema: ChantSchema },
      { name: 'categories', schema: CategoriesSchema },
    ]),
    ThrottlerModule.forRoot({
      throttlers: [
        {
          ttl: 60000,
          limit: 100,
        },
      ],
    }),
  ],
  controllers: [
    UserController,
    ChantController,
    CategoriesController,
    ImageController,
    CsrfController,
  ],
  providers: [
    UserService,
    ChantService,
    CategoriesService,
    ImageService,
    ImageKitConfig,
  ],
})
export class AppModule {}
