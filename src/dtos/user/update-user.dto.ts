import { IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto {
  @IsString()
  @MaxLength(50)
  @IsNotEmpty()
  @ApiProperty({
    example: 'Schuvi',
    description: 'The name of the user',
    required: true,
    type: String,
    maxLength: 50,
    minLength: 1,
  })
  readonly name: string;

  @IsString()
  @MaxLength(100)
  @IsNotEmpty()
  @ApiProperty({
    example: 'user@example.com',
    description: 'The email of the user',
    required: true,
    type: String,
    maxLength: 100,
    minLength: 6,
  })
  readonly email: string;
}
