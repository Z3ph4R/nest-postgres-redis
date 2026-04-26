import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';

@Injectable()
export class ProductsService {
  private products: any[] = []; 

  create(dto: CreateProductDto) {
    const newProduct = { id: Date.now(), ...dto };
    this.products.push(newProduct);
    return newProduct;
  }

  findAll() {
    return this.products;
  }
}