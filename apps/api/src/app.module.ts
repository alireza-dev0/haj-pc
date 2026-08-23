import { Module } from '@nestjs/common';
import { SharedModule } from './modules/shared/shared.module';
import { ConfigModule } from '@nestjs/config';

@Module({
    imports: [
        SharedModule,

        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: process.env.NODE_ENV === 'production' ? '.env' : '.env.development'
        }),
    ],
    controllers: [],
    providers: [],
})
export class AppModule {}
