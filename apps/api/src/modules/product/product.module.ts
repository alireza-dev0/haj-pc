import { Module } from '@nestjs/common';
import { RolesGuard } from '../../common/guards/roles.guard';
import { StorageModule } from '../storage/storage.module';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';

@Module({
  imports: [StorageModule],
  controllers: [ProductController],
  providers: [ProductService, RolesGuard],
})
export class ProductModule {}
