import { CreateChantDto } from './create-chant.dto';
import { PartialType } from '@nestjs/mapped-types';

export class UpdateChantDto extends PartialType(CreateChantDto) {}
// This class extends CreateChantDto and makes all properties optional,
// allowing for partial updates to a chant. It uses the PartialType utility
// from @nestjs/mapped-types to automatically generate the necessary Swagger metadata.
