import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
    Strategy,
    'jwt-refresh',
) {
    constructor(private readonly configService: ConfigService) {
        super({
            jwtFromRequest: ExtractJwt.fromExtractors([
                (req: Request) => req.cookies['refresh_token'],
            ]),
            secretOrKey: configService.get('JWT_SECRET') as string,
        });
    }

    validate(payload: RefreshJwtPayload): RefreshJwtPayload {
        return payload;
    }
}
