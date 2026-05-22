import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CacheModule } from '@nestjs/cache-manager';
import * as redisStore from 'cache-manager-redis-yet';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { CategoriesController } from './categories/categories.controller';
import { CategoriesService } from './categories/categories.service';
import { ProductsController } from './products/products.controller';
import { ProductsService } from './products/products.service';

import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { OrdersModule } from './orders/orders.module';

// Импорт сущностей
import { Product } from './products/entities/product.entity';
import { Category } from './categories/category.entity';
import { Order } from './orders/entities/order.entity';
import { OrderItem } from './orders/entities/order-item.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ 
      isGlobal: true,
      envFilePath: '.env', 
    }),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST', 'postgres'),
        port: configService.get<number>('DB_PORT', 5432),
        username: configService.get<string>('DB_USERNAME', 'postgres'),
        password: configService.get<string>('DB_PASSWORD', 'postgres'),
        database: configService.get<string>('DB_DATABASE', 'nestdb'),
        entities: [Product, Category, Order, OrderItem],
        autoLoadEntities: true,
        synchronize: true,
      }),
    }),

    // РЕШЕНИЕ: Регистрируем репозитории продуктов и категорий для AppModule контекста
    TypeOrmModule.forFeature([Product, Category]),

    CacheModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const redisHost = configService.get<string>('REDIS_HOST', 'redis');
        const redisPort = configService.get<number>('REDIS_PORT', 6379);
        return {
          isGlobal: true, // Делаем кэш глобальным для всех модулей
          store: redisStore,
          url: `redis://${redisHost}:${redisPort}`,
        };
      },
    }),

    UsersModule,
    AuthModule,
    OrdersModule,
  ],
  controllers: [
    AppController, 
    CategoriesController, 
    ProductsController
  ],
  providers: [
    AppService, 
    CategoriesService, 
    ProductsService
  ],
})
export class AppModule {}