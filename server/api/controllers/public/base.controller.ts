import { Controller, Get, Param, Res } from "@nestjs/common";
import { Throttle } from "@nestjs/throttler";
import { AbstractController } from "@server/api/abstractions/abstract.controller";
import { ClientStatusDto } from "@server/api/dto/public/base/client-status.dto";
import { config } from "@src/structures/Application";
import StatsCommand from "@src/global/commands/information/StatsCommand";
import { Permissions } from "discord.js";
import { constants } from "http2";

@Controller("public/")
export class BasePublicController extends AbstractController {
    public static readonly defaultClientPermissions: Permissions = new Permissions([Permissions.FLAGS.ADMINISTRATOR, Permissions.FLAGS.VIEW_AUDIT_LOG, Permissions.FLAGS.MANAGE_WEBHOOKS]);

    @Get("status")
    @Throttle(30, 60)
    public async execute(): Promise<ClientStatusDto> {
        return {
            guildCount: StatsCommand.clientStatistics.guilds,
            userCount: StatsCommand.clientStatistics.users
        };
    }

    @Get("invite/:id")
    public async invite(
        @Param("id") id: string,
        @Res() res
    ): Promise<void> {
        let redirectUrl: string;

        if (id) {
            redirectUrl = `https://discord.com/oauth2/authorize?client_id=${config.client.user.id}&guild_id=${id}&scope=bot&permissions=${BasePublicController.defaultClientPermissions.bitfield}`;
        } else {
            redirectUrl = `https://discord.com/oauth2/authorize?client_id=${config.client.user.id}&scope=bot&permissions=${BasePublicController.defaultClientPermissions.bitfield}`;
        }

        res.status(constants.HTTP_STATUS_FOUND).redirect(redirectUrl);
    }
}
