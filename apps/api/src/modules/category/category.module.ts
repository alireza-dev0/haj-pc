import { Module } from '@nestjs/common';
import { RolesGuard } from '../../common/guards/roles.guard';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';

@Module({
  controllers: [CategoryController],
  providers: [CategoryService, RolesGuard],
})
export class CategoryModule {}
