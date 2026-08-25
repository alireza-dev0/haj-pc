import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { UserRole } from 'app/prisma/generated/client';
import { Roles } from '../../common/decorators/roles.decorator';
import { RolesGuard } from '../../common/guards/roles.guard';
import { DashboardService } from './dashboard.service';
import {
    DashboardDto_Query,
    DashboardStatsDto_Response,
} from './DTOs/dashboard.dto';

@ApiTags('dashboard')
@Controller('dashboard')
@UseGuards(AuthGuard('jwt-access'), RolesGuard)
@Roles(UserRole.ADMIN)
export class DashboardController {
    constructor(private readonly dashboardService: DashboardService) {}

    @Get('stats')
    @ApiOkResponse({ type: DashboardStatsDto_Response })
    async handleGetStats(
        @Query() query: DashboardDto_Query,
    ): Promise<DashboardStatsDto_Response> {
        return this.dashboardService.getStats(query.period);
    }
}
