import {
    ExecutionContext,
    Injectable,
    UnauthorizedException,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

@Injectable()
export class RefreshGuard extends AuthGuard('jwt-refresh') {
    handleRequest<T extends RefreshJwtPayload = RefreshJwtPayload>(
        err: unknown,
        user: T,
        _info: unknown,
        context: ExecutionContext,
    ): T {
        if (err || !user) {
            throw err || new UnauthorizedException();
        }

        const request = context.switchToHttp().getRequest<Request>();
        request.refresh = { payload: user };
        delete request.user;

        return user;
    }
}
