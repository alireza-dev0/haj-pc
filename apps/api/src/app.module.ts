import { Module } from '@nestjs/common';
import { SharedModule } from './modules/shared/shared.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { CategoryModule } from './modules/category/category.module';
import { ProductModule } from './modules/product/product.module';
import { DashboardModule } from './modules/dashboard/dashboard.module';
import { OrderModule } from './modules/order/order.module';
import { StorageModule } from './modules/storage/storage.module';
import { SearchModule } from './modules/search/search.module';
import { AppController } from './app.controller';

@Module({
    imports: [
        SharedModule,

        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: process.env.NODE_ENV === 'production' ? '.env' : '.env.development'
        }),

        AuthModule,

        UsersModule,

        CategoryModule,

        ProductModule,

        DashboardModule,

        OrderModule,

        StorageModule,

        SearchModule,
    ],
    controllers: [AppController],
    providers: [],
})
export class AppModule {}
