import { Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoriesService {
  /**
   * Виправлення: явно вказуємо тип any[] або CreateCategoryDto[], 
   * щоб TypeScript не видавав помилку "type never".
   */
  private categories: any[] = []; 

  /**
   * Створення нової категорії.
   * Використовуємо CreateCategoryDto для суворої типізації вхідних даних.
   */
  create(dto: CreateCategoryDto) {
    const newCategory = { 
      id: Date.now(), 
      ...dto 
    };
    this.categories.push(newCategory);
    return newCategory;
  }

  /**
   * Повертає список усіх категорій.
   */
  findAll() {
    return this.categories;
  }

  /**
   * Знайти одну категорію за ID.
   */
  findOne(id: number) {
    return this.categories.find(cat => cat.id === id);
  }

  /**
   * Оновлення категорії.
   * Використовуємо UpdateCategoryDto, де всі поля необов'язкові.
   */
  update(id: number, dto: UpdateCategoryDto) {
    const index = this.categories.findIndex(cat => cat.id === id);
    if (index !== -1) {
      this.categories[index] = { ...this.categories[index], ...dto };
      return this.categories[index];
    }
    return null;
  }

  /**
   * Видалення категорії.
   */
  remove(id: number) {
    this.categories = this.categories.filter(cat => cat.id !== id);
    return { deleted: true };
  }
}