import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { UserRole } from 'app/prisma/generated/client';
import { Roles } from '../../common/decorators/roles.decorator';
import { RolesGuard } from '../../common/guards/roles.guard';
import { SearchService } from './search.service';
import { SearchDto_Query, SearchDto_Response } from './DTOs/search.dto';

@ApiTags('search')
@Controller('search')
@UseGuards(AuthGuard('jwt-access'), RolesGuard)
@Roles(UserRole.ADMIN)
export class SearchController {
    constructor(private readonly searchService: SearchService) {}

    @Get()
    @ApiOkResponse({ type: SearchDto_Response })
    async handleSearch(
        @Query() query: SearchDto_Query,
    ): Promise<SearchDto_Response> {
        return this.searchService.search({
            q: query.q,
            limit: query.limit,
        });
    }
}
