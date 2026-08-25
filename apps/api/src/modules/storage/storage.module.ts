import { Module } from '@nestjs/common';
import { RolesGuard } from '../../common/guards/roles.guard';
import { StorageController } from './storage.controller';
import { StorageService } from './storage.service';
import { SupabaseService } from './supabase.service';

@Module({
    controllers: [StorageController],
    providers: [SupabaseService, StorageService, RolesGuard],
    exports: [SupabaseService, StorageService],
})
export class StorageModule {}
