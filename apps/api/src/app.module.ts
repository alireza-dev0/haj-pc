import { Module } from '@nestjs/common';
import { SharedModule } from './modules/shared/shared.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { CategoryModule } from './modules/category/category.module';
import { ProductModule } from './modules/product/product.module';

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
    ],
    controllers: [],
    providers: [],
})
export class AppModule {}
