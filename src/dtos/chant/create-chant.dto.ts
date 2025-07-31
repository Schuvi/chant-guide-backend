import { IsNotEmpty, IsString, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateChantDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'The title of the chant',
    required: true,
    type: String,
    maxLength: 100,
    minLength: 1,
  })
  readonly title: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Url video of the chant',
    required: true,
    type: String,
    minLength: 1,
  })
  readonly videoUrl: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'The lyrics of the chant',
    required: true,
    type: String,
    minLength: 1,
  })
  readonly content: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'ImageId of chant',
    required: true,
    type: String,
    minLength: 1,
  })
  readonly imageId: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Image of chant',
    required: true,
    type: String,
    minLength: 1,
  })
  readonly image: string;
}
