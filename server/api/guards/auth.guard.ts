import {
    CanActivate,
    ExecutionContext,
    ForbiddenException,
    Injectable,
    InternalServerErrorException,
    UnauthorizedException
} from "@nestjs/common";
import { OAuth2Controller } from "@server/api/controllers/oauth2/oauth2.controller";
import { TokenType } from "@server/api/dto/oauth2/responseData.dto";
import { UserDto } from "@server/api/dto/oauth2/user.dto";

@Injectable()
export class AuthGuard implements CanActivate {
    public async canActivate(context: ExecutionContext): Promise<boolean> {
        const request: any = context.switchToHttp().getRequest();

        if (!request.headers.authorization) {
            throw new UnauthorizedException();
        }

        request.data = await this.validateRequest(request.headers.authorization);

        return true;
    }

    public async validateRequest(authorization: string): Promise<{
        user: UserDto,
        authorization: string
    }> {
        const [tokenType, token] = authorization?.trim()?.split(" ");

        if (!tokenType || !token) {
            throw new ForbiddenException({
                message: "Invalid authorization provided."
            });
        }

        let user: UserDto;

        try {
            user = await OAuth2Controller.getDiscordUser(<TokenType>tokenType, token);
        } catch (e) {
            throw new InternalServerErrorException({
                message: "Authorization failed",
                statusCode: e?.response?.status || e?.statusCode
            });
        }

        return {
            user: user,
            authorization: `${tokenType} ${token}`
        };
    }
}
