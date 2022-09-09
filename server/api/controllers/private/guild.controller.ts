import {
    BadRequestException,
    Controller,
    ForbiddenException,
    Get,
    HttpException,
    Param,
    Req,
    UseGuards
} from "@nestjs/common";
import { Throttle } from "@nestjs/throttler";
import { AbstractController } from "@server/api/abstractions/abstract.controller";
import { UserDto } from "@server/api/dto/oauth2/user.dto";
import { GuildDto } from "@server/api/dto/private/guild.dto";
import { AuthGuard } from "@server/api/guards/auth.guard";
import { TwitchService } from "@src/api/services/TwitchService";
import { SubscriptionType } from "@src/api/subscriptions/BasePosting";
import { Application } from "@src/structures/Application";
import { SearchChannels } from "@src/packages/twitchJS/interfaces/SearchChannels";
import { ShardUtils } from "@src/utils/ShardUtils";
import axios, { AxiosError, AxiosResponse } from "axios";
import { Permissions, Shard } from "discord.js";
import { constants } from "http2";

@Controller("/private/")
@UseGuards(AuthGuard)
export class GuildController extends AbstractController {
    @Get("guild/list")
    @Throttle(3, 10)
    public async getGuildList(
        @Req() request: { data: UserDto & { authorization: string } }
    ): Promise<GuildDto[]> {
        if (!request.data.authorization) {
            throw new ForbiddenException({
                message: "You are not authorized."
            });
        }

        const response: AxiosResponse<GuildDto[]> & AxiosError = await axios.get(GuildController.requestUrl + "users/@me/guilds", {
            headers: {
                "authorization": request.data.authorization
            }
        })
            .catch(e => e);

        if (response.isAxiosError) {
            if (response.response?.status === constants.HTTP_STATUS_UNAUTHORIZED) {
                throw new ForbiddenException({
                    message: "You are not authorized."
                });
            } else {
                throw new HttpException({
                    message: "Failed to make Discord API request."
                }, constants.HTTP_STATUS_INTERNAL_SERVER_ERROR);
            }
        }

        const guilds: GuildDto[] = [];

        for (const guild of response.data) {
            if (!guild) {
                continue;
            }

            const permissions: Permissions = new Permissions(BigInt(guild.permissions || 0));

            if (permissions.has(Permissions.FLAGS.ADMINISTRATOR) || guild.owner) {
                const shard: Shard = Application.shardingManager.shards.get(ShardUtils.getShardID(guild.id));

                if (!shard) {
                    continue;
                }

                guilds.push({
                    ...guild,
                    // language=JavaScript
                    withBot: <boolean>await shard.eval(`this.guilds.cache.has("${guild.id}")`)
                });
            }
        }

        return guilds.sort((a: GuildDto, b: GuildDto): number => {
            if (a.withBot !== b.withBot) {
                return a.withBot ? -1 : 1;
            } else {
                return a.name > b.name ? 1 : -1;
            }
        });
    }

    @Get("subscriptions/:type/:query")
    @Throttle(5, 10)
    public async getSubscriptions(
        @Param("type") subscriptionType: SubscriptionType,
        @Param("query") query: string
    ): Promise<any> {
        if (!subscriptionType || !query) {
            throw new BadRequestException({
                message: "Subscription type or query wasn't specified."
            });
        }

        switch (subscriptionType) {
            case "vk": {
                break;
            }
            case "youtube": {
                break;
            }
            case "twitch": {
                TwitchService.instance.searchChannels(query)
                    .then((e: SearchChannels) => {
                        return e.channels.map(e => {
                            return {
                                id: e._id,
                                username: e.display_name,
                                logo: e.logo
                            };
                        });
                    })
                    .catch(() => {
                        return [];
                    });

                break;
            }
            default: {
                throw new BadRequestException({
                    message: "Specified type of subscription doesn't exist."
                });
            }
        }
    }
}
