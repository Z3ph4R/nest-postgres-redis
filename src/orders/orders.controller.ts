import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiBody, ApiResponse } from '@nestjs/swagger';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { OrderQueryDto } from './dto/order-query.dto';

// Правильные относительные пути
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { CurrentUser } from '../auth/current-user.decorator';
import { Role } from '../common/enums/role.enum';

@ApiTags('Orders')
@ApiBearerAuth()
@Controller('orders')
@UseGuards(JwtAuthGuard, RolesGuard)
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @ApiOperation({ summary: 'Створити замовлення' })
  @ApiBody({ type: () => CreateOrderDto }) // Обернули в функцию для предотвращения undefined в Swagger
  create(
    @Body() createOrderDto: CreateOrderDto,
    @CurrentUser('sub') userId: number,
  ) {
    return this.ordersService.create(createOrderDto, userId);
  }

  @Get()
  @ApiOperation({ summary: 'Мої замовлення (user) / Всі (admin)' })
  findAll(
    @Query() query: OrderQueryDto,
    @CurrentUser('sub') userId: number,
    @CurrentUser('role') role: Role,
  ) {
    return this.ordersService.findAll(query, userId, role);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Одне замовлення (ownership check)' })
  findOne(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser('sub') userId: number,
    @CurrentUser('role') role: Role,
  ) {
    return this.ordersService.findOne(id, userId, role);
  }

  @Patch(':id/status')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Змінити статус (Тільки Admin)' })
  @ApiBody({ type: () => UpdateOrderStatusDto }) // Обернули в функцию
  updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateOrderStatusDto: UpdateOrderStatusDto,
  ) {
    return this.ordersService.updateStatus(id, updateOrderStatusDto);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Видалити замовлення (Тільки Admin)' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.ordersService.remove(id);
  }
}