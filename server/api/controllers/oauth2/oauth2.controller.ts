import {
    Body,
    Controller,
    Get,
    InternalServerErrorException,
    Post,
    Req,
    Res,
    UnauthorizedException
} from "@nestjs/common";
import { Throttle } from "@nestjs/throttler";
import { AbstractController } from "@server/api/abstractions/abstract.controller";
import { ResponseDataDto, TokenType } from "@server/api/dto/oauth2/responseData.dto";
import { TokenDto } from "@server/api/dto/oauth2/token.dto";
import { UserDto } from "@server/api/dto/oauth2/user.dto";
import { ReynardApiWorker } from "@server/api/structures/ReynardApiWorker";
import { config } from "@src/structures/Application";
import axios, { AxiosResponse } from "axios";
import { Request, Response } from "express";
import { constants } from "http2";
import { URLSearchParams } from "url";

@Controller("oauth2/")
export class OAuth2Controller extends AbstractController {
    @Post("user")
    @Throttle(1, 15)
    public async user(
        @Body() body: TokenDto
    ): Promise<{
        user: UserDto,
        responseData: ResponseDataDto
    }> {
        const data: Record<any, any> = {
            "grant_type": "authorization_code",
            "client_id": config.client.user.id,
            "client_secret": config.clientSecret,
            "redirect_uri": config.redirectURI,
            "code": body.code,
            "scope": config.scope
        };

        const response: AxiosResponse = await axios.post(OAuth2Controller.requestUrl + "oauth2/token",
            new URLSearchParams(data), {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                }
            }).catch(() => {
            throw new InternalServerErrorException({
                message: "Failed to create Discord API request."
            });
        });

        const responseData: ResponseDataDto = response.data;

        const user: UserDto = await OAuth2Controller.getDiscordUser(responseData.token_type, responseData.access_token)
            .catch(() => {
                throw new UnauthorizedException();
            });

        return {
            user: user,
            responseData: responseData
        };
    }

    @Get("auth")
    public async authRedirect(
        @Res() res: Response
    ): Promise<any> {
        res.status(constants.HTTP_STATUS_FOUND).redirect(config.oauthURL);
    }

    @Get("redirect")
    public async redirect(
        @Req() req: Request,
        @Res() res: Response
    ): Promise<any> {
        if (!req.query.code) {
            res.status(constants.HTTP_STATUS_FOUND).redirect(ReynardApiWorker.baseAddress);
            return;
        }

        res.status(constants.HTTP_STATUS_FOUND).redirect(ReynardApiWorker.baseAddress + "?code=" + req.query.code);
    }

    public static async getDiscordUser(tokenType: TokenType, token: string): Promise<UserDto> {
        return new Promise((resolve, reject) => {
            axios.get(this.requestUrl + "users/@me", {
                headers: {
                    "authorization": `${tokenType} ${token}`
                }
            })
                .then((response: AxiosResponse) => {
                    resolve(response.data);
                });
        });
    }
}
