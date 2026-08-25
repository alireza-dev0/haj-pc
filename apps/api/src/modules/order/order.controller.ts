import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Query,
    UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { UserRole } from 'app/prisma/generated/client';
import { Roles } from '../../common/decorators/roles.decorator';
import { RolesGuard } from '../../common/guards/roles.guard';
import { OrderService } from './order.service';
import {
    OrderDeleteDto_Response,
    OrderDetailDto_Response,
    OrderDto_Query,
    OrderListDto_Response,
    UpdateOrderStatusDto_Request,
} from './DTOs/order.dto';

@ApiTags('order')
@Controller('order')
@UseGuards(AuthGuard('jwt-access'), RolesGuard)
@Roles(UserRole.ADMIN)
export class OrderController {
    constructor(private readonly orderService: OrderService) {}

    @Get()
    @ApiOkResponse({ type: OrderListDto_Response })
    async handleGetOrders(
        @Query() query: OrderDto_Query,
    ): Promise<OrderListDto_Response> {
        return this.orderService.getOrders({
            q: query.q,
            status: query.status,
            page: query.page,
            pageSize: query.pageSize,
        });
    }

    @Get(':id')
    @ApiOkResponse({ type: OrderDetailDto_Response })
    async handleGetOrderById(
        @Param('id') id: string,
    ): Promise<OrderDetailDto_Response> {
        return this.orderService.getOrderById(id);
    }

    @Patch(':id/status')
    @ApiOkResponse({ type: OrderDetailDto_Response })
    async handleUpdateOrderStatus(
        @Param('id') id: string,
        @Body() body: UpdateOrderStatusDto_Request,
    ): Promise<OrderDetailDto_Response> {
        return this.orderService.updateOrderStatus(id, body.status);
    }

    @Delete(':id')
    @ApiOkResponse({ type: OrderDeleteDto_Response })
    async handleDeleteOrder(
        @Param('id') id: string,
    ): Promise<OrderDeleteDto_Response> {
        return this.orderService.deleteOrder(id);
    }
}
