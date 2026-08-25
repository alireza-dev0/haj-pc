import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { CategoryService } from './category.service';
import { CategoryDto_Response } from './DTOs/category.dto';

@ApiTags('category')
@Controller('category')
export class CategoryController {
    constructor(private readonly categoryService: CategoryService) {}

    @Get()
    @ApiOkResponse({ type: [CategoryDto_Response] })
    async handleGetCategories(): Promise<CategoryDto_Response[]> {
        return this.categoryService.getCategories();
    }
}
