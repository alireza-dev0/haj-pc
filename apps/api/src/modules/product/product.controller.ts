import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Post,
    Query,
    UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { UserRole } from 'app/prisma/generated/client';
import { Roles } from '../../common/decorators/roles.decorator';
import { RolesGuard } from '../../common/guards/roles.guard';
import { ProductService } from './product.service';
import {
    CreateProductDto_Request,
    ProductDeleteDto_Response,
    ProductDetailDto_Response,
    ProductDto_Query,
    ProductListDto_Response,
    UpdateProductDto_Request,
} from './DTOs/product.dto';

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

    @UseGuards(AuthGuard('jwt-access'))
    @Get(':id')
    @ApiOkResponse({ type: ProductDetailDto_Response })
    async handleGetProductById(
        @Param('id') id: string,
    ): Promise<ProductDetailDto_Response> {
        return this.productService.getProductById(id);
    }

    @UseGuards(AuthGuard('jwt-access'), RolesGuard)
    @Roles(UserRole.ADMIN)
    @Post()
    @ApiOkResponse({ type: ProductDetailDto_Response })
    async handleCreateProduct(
        @Body() body: CreateProductDto_Request,
    ): Promise<ProductDetailDto_Response> {
        return this.productService.createProduct(body);
    }

    @UseGuards(AuthGuard('jwt-access'), RolesGuard)
    @Roles(UserRole.ADMIN)
    @Patch(':id')
    @ApiOkResponse({ type: ProductDetailDto_Response })
    async handleUpdateProduct(
        @Param('id') id: string,
        @Body() body: UpdateProductDto_Request,
    ): Promise<ProductDetailDto_Response> {
        return this.productService.updateProduct(id, body);
    }

    @UseGuards(AuthGuard('jwt-access'), RolesGuard)
    @Roles(UserRole.ADMIN)
    @Delete(':id')
    @ApiOkResponse({ type: ProductDeleteDto_Response })
    async handleDeleteProduct(
        @Param('id') id: string,
    ): Promise<ProductDeleteDto_Response> {
        return this.productService.deleteProduct(id);
    }
}
