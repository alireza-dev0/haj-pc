import { Controller, Get, Query } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { ProductService } from './product.service';
import { ProductDto_Query, ProductListDto_Response } from './DTOs/product.dto';

@ApiTags('product')
@Controller('product')
export class ProductController {
    constructor(private readonly productService: ProductService) {}

    @Get()
    @ApiOkResponse({ type: ProductListDto_Response })
    async handleGetProducts(
        @Query() query: ProductDto_Query,
    ): Promise<ProductListDto_Response> {
        return this.productService.getProducts({
            search: query.search,
            categoryId: query.categoryId,
            sort: query.sort,
            page: query.page,
            pageSize: query.pageSize,
        });
    }
}
