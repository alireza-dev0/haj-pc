import { Module } from '@nestjs/common';
import { RolesGuard } from '../../common/guards/roles.guard';
import { SearchController } from './search.controller';
import { SearchService } from './search.service';

@Module({
    controllers: [SearchController],
    providers: [SearchService, RolesGuard],
})
export class SearchModule {}
