import { Module } from '@nestjs/common';
import { RolesGuard } from '../../common/guards/roles.guard';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';

@Module({
    controllers: [OrderController],
    providers: [OrderService, RolesGuard],
})
export class OrderModule {}
