import { Controller, Post, Body, UseGuards, Req, Patch, Get, Param } from '@nestjs/common';
import { OrderService } from './order.service';
import { ApplyOrderDto } from './dto/apply-order.dto';
import { SelectProviderDto } from './dto/select-provider.dto';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth-guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Request as ExpressRequest } from 'express';
import { AssignWorkersDto } from './dto/assign-workers.dto';

@ApiTags('Orders')
@Controller('orders')
@UseGuards(JwtAuthGuard, RolesGuard)
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @ApiOperation({ summary: 'Create a new order' })
  @ApiBearerAuth()
  @Post()
  @Roles('broker')
  async createOrder(@Req() req: ExpressRequest, @Body() createOrderDto: CreateOrderDto) {
    const brokerId = req.user.id;
    return this.orderService.createOrder(brokerId, createOrderDto);
  }

  @ApiOperation({ summary: 'Apply for an order' })
  @ApiBearerAuth()
  @Post('apply')
  @Roles('provider')
  async applyForOrder(@Req() req: ExpressRequest, @Body() applyOrderDto: ApplyOrderDto) {
    const providerId = req.user.id;
    return this.orderService.applyForOrder(providerId, applyOrderDto);
  }

  @ApiOperation({ summary: 'Select a provider for an order' })
  @ApiBearerAuth()
  @Patch('select-provider')
  @Roles('broker')
  async selectProvider(@Req() req: ExpressRequest, @Body() selectProviderDto: SelectProviderDto) {
    const brokerId = req.user.id;
    return this.orderService.selectProvider(brokerId, selectProviderDto);
  }

  @ApiOperation({ summary: 'Update order status' })
  @ApiBearerAuth()
  @Patch(':orderId/status')
  @Roles('broker', 'provider')
  async updateOrderStatus(@Param('orderId') orderId: number, @Body() updateOrderDto: UpdateOrderDto) {
    return this.orderService.updateOrderStatus(orderId, updateOrderDto);
  }

  @ApiOperation({ summary: 'Get all orders for a broker' })
  @ApiBearerAuth()
  @Get('broker')
  @Roles('broker')
  async getOrdersByBroker(@Req() req: ExpressRequest) {
    const brokerId = req.user.id;
    return this.orderService.getOrdersByBroker(brokerId);
  }

  @ApiOperation({ summary: 'Get all orders for a provider' })
  @ApiBearerAuth()
  @Get('provider')
  @Roles('provider')
  async getOrdersByProvider(@Req() req: ExpressRequest) {
    const providerId = req.user.id;
    return this.orderService.getOrdersByProvider(providerId);
  }

  @ApiOperation({ summary: 'Assign workers to an order' })
  @ApiBearerAuth()
  @Patch(':orderId/assign-workers')
  @Roles('provider')
  async assignWorkersToOrder(@Param('orderId') orderId: number, @Body() assignWorkersDto: AssignWorkersDto) {
    return this.orderService.assignWorkersToOrder(orderId, assignWorkersDto);
  }
}
