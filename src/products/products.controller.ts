import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Products') // Группирует методы в раздел Products
@Controller('api/products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @UseGuards(JwtAuthGuard) // Только создание требует токен
  @ApiBearerAuth() // Добавляет значок замка в Swagger
  @ApiOperation({ summary: 'Створити новий продукт' })
  create(@Body() dto: CreateProductDto) {
    return this.productsService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Отримати всі продукти' }) // Просмотр доступен всем
  findAll() {
    return this.productsService.findAll();
  }
}