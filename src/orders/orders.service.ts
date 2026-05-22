import { 
  Injectable, 
  NotFoundException, 
  BadRequestException, 
  Inject 
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager'; // Исправлен импорт типа для isolatedModules

// Сущности
import { Order } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { Product } from '../products/entities/product.entity';

// DTO
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { OrderQueryDto } from './dto/order-query.dto';

// Импортируем ОРИГИНАЛЬНЫЙ энум из твоего проекта, чтобы не было конфликта типов
import { OrderStatus } from '../common/enums/order-status.enum';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepo: Repository<Order>,

    @InjectRepository(OrderItem)
    private readonly orderItemRepo: Repository<OrderItem>,

    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,

    @Inject(CACHE_MANAGER) 
    private readonly cacheManager: Cache,
  ) {}

  async create(createOrderDto: CreateOrderDto, userId: number) {
    // Передаем пользователя как объект связи, так как прямого поля userId в Order нет
    const order = this.orderRepo.create({
      ...createOrderDto,
      user: { id: userId } as any, 
      status: OrderStatus.PENDING,
    });
    const savedOrder = await this.orderRepo.save(order);
    await this.clearProductsCache();
    return savedOrder;
  }

  async findAll(query: OrderQueryDto, userId: number, role: string) {
    // Если не админ, фильтруем по вложенному ID связи user
    const whereClause = role === 'ADMIN' ? {} : { user: { id: userId } };
    return await this.orderRepo.find({
      where: whereClause,
      relations: ['items', 'items.product', 'user'],
    });
  }

  async findOne(id: number, userId: number, role: string) {
    const order = await this.orderRepo.findOne({
      where: { id },
      relations: ['items', 'items.product', 'user'],
    });

    if (!order) {
      throw new NotFoundException(`Order #${id} not found`);
    }

    // Проверяем права через связь order.user.id
    if (role !== 'ADMIN' && (!order.user || order.user.id !== userId)) {
      throw new BadRequestException('You do not have permission to view this order');
    }

    return order;
  }

  async updateStatus(id: number, dto: UpdateOrderStatusDto) {
    const order = await this.orderRepo.findOne({
      where: { id },
      relations: ['items', 'items.product'],
    });

    if (!order) {
      throw new NotFoundException(`Order #${id} not found`);
    }

    // Проверяем переходы статусов
    if (!this.isValidStatusTransition(order.status, dto.status)) {
      throw new BadRequestException(
        `Cannot change status from ${order.status} to ${dto.status}`,
      );
    }

    order.status = dto.status as OrderStatus;
    const updated = await this.orderRepo.save(order);

    // Сверяем с оригинальным энумом проекта
    if (dto.status === OrderStatus.CANCELLED) {
      await this.restoreStock(order);
    }

    return updated;
  }

  async remove(id: number) {
    const result = await this.orderRepo.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Order #${id} not found`);
    }
    return { deleted: true };
  }

  private isValidStatusTransition(currentStatus: string, newStatus: string): boolean {
    const allowedTransitions: Record<string, string[]> = {
      'PENDING': ['PROCESSING', 'CANCELLED'],
      'PROCESSING': ['COMPLETED', 'CANCELLED'],
      'COMPLETED': [],
      'CANCELLED': [],
    };

    return allowedTransitions[currentStatus]?.includes(newStatus) ?? false;
  }

  private async restoreStock(order: Order & { items?: any[] }): Promise<void> {
    if (!order.items || order.items.length === 0) return;

    for (const item of order.items) {
      if (item.product) {
        item.product.stock += item.quantity;
        await this.productRepo.save(item.product);
      }
    }
  }

  private async clearProductsCache(): Promise<void> {
    try {
      await this.cacheManager.del('products_cache_key');
    } catch (error) {
      // Игнорируем проблемы с кэшем при сборке
    }
  }
}