import {
    Body,
    Controller,
    Get,
    Patch,
    Post,
    Req,
    Res,
    UnauthorizedException,
    UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { JwtService } from '@nestjs/jwt';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import type { Response } from 'express';
import { AuthService } from './auth.service';
import { SigninDto_Request, SigninDto_Response } from './DTOs/signin.dto';
import { SignupDto_Request, SignupDto_Response } from './DTOs/signup.dto';
import {
    UpdateProfileDto_Request,
    UpdateProfileDto_Response,
} from './DTOs/update-profile.dto';
import { RefreshGuard } from './guards/refresh.guard';
import { UserRole } from '@repo/types';

const ACCESS_MAX_AGE_MS = 15 * 60 * 1000;
const REFRESH_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000;

const cookieOptions = {
    httpOnly: true,
    sameSite: 'lax' as const,
    path: '/',
};

@ApiTags('auth')
@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
        private readonly jwtService: JwtService,
    ) {}

    @UseGuards(AuthGuard('jwt-access'))
    @Get('/me')
    async handleGetMe(@Req() req: Request) {
        return req.user;
    }

    @Post('/signin')
    @ApiOkResponse({ type: SigninDto_Response })
    async handleSignin(
        @Body() body: SigninDto_Request,
        @Res({ passthrough: true }) res: Response,
    ): Promise<SigninDto_Response> {
        const user = await this.authService.signin({
            email: body.email,
            password: body.password,
        });
        this.setAuthCookies(res, user);
        return user;
    }

    @Post('/signup')
    @ApiOkResponse({ type: SignupDto_Response })
    async handleSignup(
        @Body() body: SignupDto_Request,
        @Res({ passthrough: true }) res: Response,
    ): Promise<SignupDto_Response> {
        const user = await this.authService.signup({
            email: body.email,
            password: body.password,
            name: body.name,
        });
        this.setAuthCookies(res, user);
        return user;
    }

    @UseGuards(RefreshGuard)
    @Post('/refresh')
    async handleRefresh(
        @Req() req: Request,
        @Res({ passthrough: true }) res: Response,
    ) {
        const userId = req.refresh?.payload.userId;
        if (!userId) {
            throw new UnauthorizedException();
        }

        const user = await this.authService.refresh({ id: userId });
        this.setAuthCookies(res, user);
        return user;
    }

    @UseGuards(AuthGuard('jwt-access'))
    @Patch('/profile')
    @ApiOkResponse({ type: UpdateProfileDto_Response })
    async handleUpdateProfile(
        @Req() req: Request,
        @Body() body: UpdateProfileDto_Request,
        @Res({ passthrough: true }) res: Response,
    ): Promise<UpdateProfileDto_Response> {
        const userId = req.user?.id;
        if (!userId) {
            throw new UnauthorizedException();
        }

        const user = await this.authService.updateProfile(userId, {
            name: body.name,
            email: body.email,
            currentPassword: body.currentPassword,
            newPassword: body.newPassword,
        });
        this.setAuthCookies(res, user);
        return user;
    }

    @Post('/logout')
    async handleLogout(@Res({ passthrough: true }) res: Response) {
        this.clearAuthCookies(res);
        return { ok: true };
    }

    private setAuthCookies(
        res: Response,
        user: { id: string; email: string; role: UserRole, name: string },
    ) {
        const access_token = this.jwtService.sign(
            {
                id: user.id,
                email: user.email,
                role: user.role,
                name: user.name,
            } satisfies AccessJwtPayload,
            { expiresIn: ACCESS_MAX_AGE_MS },
        );
        const refresh_token = this.jwtService.sign(
            { userId: user.id } satisfies RefreshJwtPayload,
            { expiresIn: REFRESH_MAX_AGE_MS },
        );

        res.cookie('access_token', access_token, {
            ...cookieOptions,
            maxAge: ACCESS_MAX_AGE_MS,
        });
        res.cookie('refresh_token', refresh_token, {
            ...cookieOptions,
            maxAge: REFRESH_MAX_AGE_MS,
        });
    }

    private clearAuthCookies(res: Response) {
        res.clearCookie('access_token', cookieOptions);
        res.clearCookie('refresh_token', cookieOptions);
    }
}
