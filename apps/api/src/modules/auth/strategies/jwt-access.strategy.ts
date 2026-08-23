import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";

@Injectable()
export class JwtAccessStrategy extends PassportStrategy(
    Strategy,
    'jwt-access',
) {
    constructor(private readonly configService: ConfigService) {
        super({
            jwtFromRequest: ExtractJwt.fromExtractors([
                (req: Request) => req.cookies['access_token'],
            ]),
            secretOrKey: configService.get('JWT_SECRET') as string,
        });
    }

    validate(payload: AccessJwtPayload): AccessJwtPayload {
        return payload;
    }
}
