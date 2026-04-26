import { PartialType } from '@nestjs/mapped-types';
import { CreateCategoryDto } from './create-category.dto';

// PartialType робить всі поля з CreateCategoryDto необов'язковими для PATCH запиту
export class UpdateCategoryDto extends PartialType(CreateCategoryDto) {}