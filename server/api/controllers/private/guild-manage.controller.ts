import {
    BadRequestException,
    Body,
    Controller,
    ForbiddenException,
    Get,
    Post,
    Req,
    Res,
    UseGuards
} from "@nestjs/common";
import { AbstractController } from "@server/api/abstractions/abstract.controller";
import { GuildManageCommandPackDto } from "@server/api/dto/private/guildManage/guild-manage-command-pack.dto";
import { GuildManageCommandDto } from "@server/api/dto/private/guildManage/guild-manage-command.dto";
import { GuildManageCommonDto } from "@server/api/dto/private/guildManage/guild-manage-common.dto";
import { GuildManageLoggingDto } from "@server/api/dto/private/guildManage/guild-manage-logging.dto";
import { GuildManageModerationDto } from "@server/api/dto/private/guildManage/guild-manage-moderation.dto";
import { GuildManageResetDto } from "@server/api/dto/private/guildManage/guild-manage-reset.dto";
import { GuildManageSubscriptionsDto } from "@server/api/dto/private/guildManage/guild-manage-subscriptions.dto";
import { BodyMissingException } from "@server/api/exceptions/BodyMissingException";
import { AuthGuard } from "@server/api/guards/auth.guard";
import { GuildAccessGuard } from "@server/api/guards/guild-access.guard";
import { IsSnowflakeStatic } from "@server/api/validators/is-snowflake.validator";
import { color } from "@src/assets/json/colors";
import { EventList, EventListOptions, eventsList } from "@src/assets/json/eventsList";
import { CommandOptions } from "@src/common/abstractions/command/interfaces/Command";
import { CommandDao } from "@src/database/dao/CommandDao";
import { GuildDaoManager } from "@src/database/dao/managers/GuildDaoManager";
import { Ban, BanModel } from "@src/database/models/Ban";
import { CommandConfig, CommandConfigModel, CommandConfigOptions } from "@src/database/models/CommandConfig";
import { Guild, GuildModel } from "@src/database/models/Guild";
import { Mute, MuteModel } from "@src/database/models/Mute";
import { Warn, WarnModel } from "@src/database/models/Warn";
import { createErrorLog } from "@src/scripts/Logger";
import { ShardGuildManager } from "@src/services/shard/ShardGuildManager";
import { Reynard } from "@src/structures/Reynard";
import { Guild as DiscordGuild, GuildMember } from "discord.js";
import { constants } from "http2";

@Controller("/private/guild/:id/")
@UseGuards(AuthGuard, GuildAccessGuard)
export class GuildManageController extends AbstractController {
    @Get()
    public async execute(
        @Req() req: {
            data: {
                client: GuildMember,
                guild: DiscordGuild,
                shardGuildManager: ShardGuildManager
            }
        }
    ): Promise<any> {
        return {
            ...<DiscordGuild>req.data.guild,
            roles: await req.data.shardGuildManager.fetchRoles()
                .catch((e) => createErrorLog(e, __filename)) || [],
            emojis: await req.data.shardGuildManager.fetchEmojis()
                .catch((e) => createErrorLog(e, __filename)) || [],
            webhooks: await req.data.shardGuildManager.fetchWebhooks()
                .catch((e) => createErrorLog(e, __filename)) || [],
            channels: await req.data.shardGuildManager.fetchChannels()
                .catch((e) => createErrorLog(e, __filename)) || []
        };
    }

    @Get("common")
    public async getCommon(
        @Req() req
    ): Promise<GuildManageCommonDto & {
        premium: boolean
    }> {
        const guild: GuildModel = await GuildDaoManager.getOrCreate(req.data.guild);

        return {
            prefix: guild.prefix,
            locale: guild.locale,
            commandsLocale: guild.commandsLocale,
            timezone: guild.timezone,
            mentionUsers: guild.mentionUsers,
            useReplies: guild.useReplies,
            delSucMsgAfter: guild.delSucMsgAfter,
            delErrMsgAfter: guild.delErrMsgAfter,
            color: guild.embedColor || color.grey,
            premium: guild.premiumUntil > Math.floor(new Date().getTime() / 1000),
            delSrcMsg: guild.delSrcMsg
        };
    }

    @Post("common")
    public async common(
        @Req() req: {
            data: {
                guild: DiscordGuild
            },
        },
        @Res() res,
        @Body() body: GuildManageCommonDto
    ): Promise<void> {
        if (!body) {
            throw new BodyMissingException();
        }

        GuildDaoManager.getOrCreate(req.data.guild)
            .then(async (guild: GuildModel) => {
                guild.prefix = body.prefix;
                guild.locale = body.locale;
                guild.commandsLocale = body.commandsLocale;
                guild.timezone = body.timezone;
                guild.mentionUsers = body.mentionUsers;
                guild.useReplies = body.useReplies;
                guild.delSucMsgAfter = body.delSucMsgAfter;
                guild.delErrMsgAfter = body.delErrMsgAfter;
                guild.delSrcMsg = body.delSrcMsg;
                guild.embedColor = body.color;

                await guild.save()
                    .catch(() => null);

                res.status(constants.HTTP_STATUS_OK).send();
            })
            .catch(() => {
                res.status(constants.HTTP_STATUS_BAD_REQUEST).send();
            });
    }

    @Post("subscriptions")
    public async subscriptions(
        @Body() body: GuildManageSubscriptionsDto,
        @Res() res
    ): Promise<void> {
        if (!body) {
            throw new BodyMissingException();
        }

        switch (body.type) {
            case "vk": {
                const data: { name: string, code: string } = <{ name: string, code: string }>body.data;

                if (!data?.name || !data?.code) {
                    throw new BadRequestException({
                        message: "Not enough parameters was specified."
                    });
                }

                break;
            }
            case "twitch": {
                break;
            }
            case "youtube": {
                break;
            }
            default: {
                throw new BadRequestException({
                    message: "Specified subscription type doesn't exist."
                });
            }
        }
    }

    @Get("moderation")
    public async getModeration(
        @Req() req
    ): Promise<any> {
        const guild: GuildModel = await GuildDaoManager.getOrCreate(req.data.guild);

        return {
            muteRoleID: guild.muteRoleID,
            manageableMuteRole: guild.manageableMuteRole,
            infractionActions: guild.infractionActions,
            removeRolesMute: guild.removeRolesMute,
            coolDownIgnoreRoot: guild.coolDownIgnoreRoot,
            resetWarnsOnPunishment: guild.resetWarnsOnPunishment
        };
    }

    @Post("moderation")
    public async moderation(
        @Req() req: {
            data: {
                guild: DiscordGuild
            },
        },
        @Res() res,
        @Body() body: GuildManageModerationDto
    ): Promise<void> {
        if (!body) {
            throw new BodyMissingException();
        }

        GuildDaoManager.getOrCreate(req.data.guild)
            .then(async (guild: GuildModel) => {
                guild.muteRoleID = body.muteRoleID;
                guild.manageableMuteRole = body.manageableMuteRole;
                guild.infractionActions = body.infractionActions;
                guild.removeRolesMute = body.removeRolesMute;
                guild.coolDownIgnoreRoot = body.coolDownIgnoreRoot;
                guild.resetWarnsOnPunishment = body.resetWarnsOnPunishment;

                await guild.save()
                    .catch(() => null);

                res.status(constants.HTTP_STATUS_OK).send();
            })
            .catch(() => {
                res.status(constants.HTTP_STATUS_BAD_REQUEST).send();
            });
    }

    @Post("reset")
    public async reset(
        @Req() req: {
            data: {
                guild: DiscordGuild,
                member: GuildMember
            },
        },
        @Res() res,
        @Body() body: GuildManageResetDto
    ): Promise<void> {
        if (!body) {
            throw new BodyMissingException();
        }

        if (req.data.guild.ownerId !== req.data.member.user.id) {
            throw new ForbiddenException({
                message: "You are not a guild owner."
            });
        }

        let guild: GuildModel = await GuildDaoManager.getOrCreate(req.data.guild);

        if (guild) {
            if (body.resetPunishments) {
                Warn.findAll({
                    where: {
                        guildID: req.data.guild.id
                    }
                })
                    .then((e: [WarnModel]) => {
                        void e[0]?.destroy();
                    })
                    .catch(() => null);

                await Mute.findAll({
                    where: {
                        guildID: req.data.guild.id
                    }
                })
                    .then((e: [MuteModel]) => {
                        void e[0]?.destroy();
                    })
                    .catch(() => null);

                await Ban.findAll({
                    where: {
                        guildID: req.data.guild.id
                    }
                })
                    .then((e: [BanModel]) => {
                        void e[0]?.destroy();
                    })
                    .catch(() => null);
            }

            if (body.resetSettings) {
                await guild.destroy();

                guild = await Guild.create({
                    guildID: req.data.guild.id,
                    locale: GuildDaoManager.getGuildLocale(req.data.guild)
                });
            }
        }

        res.status(constants.HTTP_STATUS_OK).send();
    }

    @Post("leave")
    public async leave(
        @Req() req: {
            data: {
                guild: DiscordGuild,
                member: GuildMember
            },
        },
        @Res() res
    ): Promise<void> {
        if (req.data.guild.ownerId !== req.data.member.user.id) {
            throw new ForbiddenException({
                message: "You are not a guild owner."
            });
        }

        await req.data.guild.leave()
            .then(() => {
                res.status(constants.HTTP_STATUS_OK).send();
            })
            .catch(() => {
                res.status(constants.HTTP_STATUS_BAD_REQUEST).send();
            });
    }

    @Get("logging")
    public async getLogging(
        @Req() req
    ): Promise<any> {
        const guild: GuildModel = await GuildDaoManager.getOrCreate(req.data.guild);

        const logs: { [name: string]: { id: string, toggle: boolean } } = {};

        for (const [key, value] of Object.entries(<EventList>guild.logs)) {
            logs[key] = {
                id: value.id,
                toggle: value.toggle
            };
        }

        return {
            toggle: guild.logModuleToggle,
            logIgnoredMembers: guild.logIgnoredMembers,
            logIgnoredChannels: guild.logIgnoredChannels,
            showLogExecutor: guild.showLogExecutor,
            listenBots: guild.listenBots,
            logs: logs
        };
    }

    @Post("logging")
    public async logging(
        @Req() req: {
            data: {
                guild: DiscordGuild,
                shardGuildManager: ShardGuildManager
            },
        },
        @Res() res,
        @Body() body: GuildManageLoggingDto
    ): Promise<void> {
        const logs: Record<string, EventListOptions> = {};

        for (const [key, value] of Object.entries(body.logs)) {
            if (key && value) {
                if (eventsList.hasOwnProperty(key)) {
                    logs[key] = {
                        id: value.id,
                        toggle: value.toggle
                    };
                }
            }
        }

        GuildDaoManager.getOrCreate(req.data.guild)
            .then(async (guild: GuildModel) => {
                const logIgnoredMembers: string[] = body.logIgnoredMembers;
                const logIgnoredChannels: string[] = body.logIgnoredChannels;

                for (const id of logIgnoredMembers) {
                    if (!IsSnowflakeStatic(id)) {
                        const index: number = logIgnoredMembers.indexOf(id);

                        logIgnoredMembers.splice(index, 1);
                    }
                }

                for (const id of logIgnoredChannels) {
                    if (!IsSnowflakeStatic(id)) {
                        const index: number = logIgnoredChannels.indexOf(id);

                        logIgnoredChannels.splice(index, 1);
                    }
                }

                guild.logModuleToggle = body.toggle;
                guild.logIgnoredChannels = logIgnoredChannels;
                guild.logIgnoredMembers = logIgnoredMembers;
                guild.showLogExecutor = body.showLogExecutor;
                guild.listenBots = body.listenBots;
                guild.logs = logs;

                await guild.save();

                res.status(constants.HTTP_STATUS_OK).send();
            })
            .catch(() => {
                res.status(constants.HTTP_STATUS_BAD_REQUEST).send();
            });
    }

    @Get("commands")
    public async getCommands(
        @Req() req: {
            data: {
                guild: DiscordGuild
            },
        }
    ): Promise<CommandConfigOptions[]> {
        const commands: CommandConfigOptions[] = [];

        const commandConfigs: CommandConfigModel[] = await CommandConfig.findAll({
            where: {
                guildID: req.data.guild.id
            }
        });

        for (const commandConfig of commandConfigs) {
            commands.push({
                key: commandConfig.key,
                toggle: commandConfig.toggle,
                delSrcMsg: commandConfig.delSrcMsg,
                hidden: commandConfig.hidden,
                nsfwOnly: commandConfig.nsfwOnly,
                coolDown: commandConfig.coolDown,
                ignoredRoles: commandConfig.ignoredRoles,
                allowedRoles: commandConfig.allowedRoles,
                ignoredChannels: commandConfig.ignoredChannels,
                allowedChannels: commandConfig.allowedChannels,
                ignoredMembers: commandConfig.ignoredMembers,
                allowedMembers: commandConfig.allowedMembers
            });
        }

        const clientCommands: CommandOptions[] = Reynard.commands.map(e => e.options);

        for (const clientCommand of clientCommands) {
            const item: CommandConfigOptions = commands.find(e => e.key === clientCommand.name);

            if (!item) {
                commands.push({
                    key: clientCommand.name,
                    toggle: true,
                    delSrcMsg: false,
                    hidden: false,
                    nsfwOnly: false,
                    coolDown: 0,
                    ignoredRoles: [],
                    allowedRoles: [],
                    ignoredChannels: [],
                    allowedChannels: [],
                    ignoredMembers: [],
                    allowedMembers: []
                });
            }
        }

        return commands;
    }

    @Post("command")
    public async command(
        @Req() req: {
            data: {
                guild: DiscordGuild
            },
        },
        @Res() res,
        @Body() body: GuildManageCommandDto
    ): Promise<void> {
        CommandDao.updateConfig(req.data.guild.id, body)
            .then(() => {
                res.status(constants.HTTP_STATUS_OK).send();
            })
            .catch(() => {
                res.status(constants.HTTP_STATUS_BAD_REQUEST).send();
            });
    }

    @Post("command/pack")
    public async commandPack(
        @Req() req: {
            data: {
                guild: DiscordGuild
            },
        },
        @Res() res,
        @Body() body: GuildManageCommandPackDto
    ): Promise<void> {
        for (const command of body.commands) {
            await CommandDao.updateConfig(req.data.guild.id, command)
                .catch(() => null);
        }

        res.status(constants.HTTP_STATUS_OK).send();
    }
}
