import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { JwtAccessStrategy } from './strategies/jwt-access.strategy';
import { JwtRefreshStrategy } from './strategies/jwt-refresh.strategy';
import { RefreshGuard } from './guards/refresh.guard';

@Module({
    imports: [
        PassportModule,
        JwtModule.registerAsync({
            useFactory: (configService: ConfigService) => ({
                secret: configService.get('JWT_SECRET')
            }),
            inject: [ConfigService]
        }),
    ],
    providers: [
        AuthService,
        JwtAccessStrategy,
        JwtRefreshStrategy,
        RefreshGuard,
    ],
    controllers: [AuthController],
})
export class AuthModule {}
