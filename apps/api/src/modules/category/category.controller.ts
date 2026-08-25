import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Post,
    UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { UserRole } from 'app/prisma/generated/client';
import { Roles } from '../../common/decorators/roles.decorator';
import { RolesGuard } from '../../common/guards/roles.guard';
import { CategoryService } from './category.service';
import {
    CategoryDto_Create,
    CategoryDto_Response,
    CategoryDto_Update,
} from './DTOs/category.dto';

@ApiTags('category')
@Controller('category')
export class CategoryController {
    constructor(private readonly categoryService: CategoryService) {}

    @Get()
    @ApiOkResponse({ type: [CategoryDto_Response] })
    async handleGetCategories(): Promise<CategoryDto_Response[]> {
        return this.categoryService.getCategories();
    }

    @Get(':id')
    @UseGuards(AuthGuard('jwt-access'))
    @ApiOkResponse({ type: CategoryDto_Response })
    async handleGetCategory(@Param('id') id: string): Promise<CategoryDto_Response> {
        return this.categoryService.getCategoryById(id);
    }

    @Post()
    @Roles(UserRole.ADMIN)
    @UseGuards(AuthGuard('jwt-access'), RolesGuard)
    @ApiOkResponse({ type: CategoryDto_Response })
    async handleCreateCategory(
        @Body() body: CategoryDto_Create,
    ): Promise<CategoryDto_Response> {
        return this.categoryService.createCategory({
            name: body.name,
            slug: body.slug,
            description: body.description,
        });
    }

    @Patch(':id')
    @Roles(UserRole.ADMIN)
    @UseGuards(AuthGuard('jwt-access'), RolesGuard)
    @ApiOkResponse({ type: CategoryDto_Response })
    async handleUpdateCategory(
        @Param('id') id: string,
        @Body() body: CategoryDto_Update,
    ): Promise<CategoryDto_Response> {
        return this.categoryService.updateCategory(id, {
            name: body.name,
            slug: body.slug,
            description: body.description,
        });
    }

    @Delete(':id')
    @Roles(UserRole.ADMIN)
    @UseGuards(AuthGuard('jwt-access'), RolesGuard)
    @ApiOkResponse({ schema: { example: { ok: true } } })
    async handleDeleteCategory(@Param('id') id: string): Promise<{ ok: true }> {
        return this.categoryService.deleteCategory(id);
    }
}
