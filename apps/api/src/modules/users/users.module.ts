import { Module } from '@nestjs/common';
import { RolesGuard } from '../../common/guards/roles.guard';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
    controllers: [UsersController],
    providers: [UsersService, RolesGuard],
})
export class UsersModule {}
