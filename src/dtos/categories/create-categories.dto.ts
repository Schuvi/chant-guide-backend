import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCategoriesDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Name for category',
    required: true,
    type: String,
    maxLength: 50,
    minLength: 1,
  })
  readonly name: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Slug for category',
    required: true,
    type: String,
    maxLength: 50,
    minLength: 1,
  })
  readonly slug: string;
}
