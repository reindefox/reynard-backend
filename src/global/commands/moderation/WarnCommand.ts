import { CommandOptions } from "@src/common/abstractions/command/interfaces/Command";
import { AbstractBaseCommand } from "@src/common/abstractions/command/model/AbstractBaseCommand";
import {
    AbstractMassMentionableUserModerationCommand,
    PunishmentInterface
} from "@src/common/abstractions/command/model/AbstractMassMentionableUserModerationCommand";
import { Ban } from "@src/database/models/Ban";
import { Warn } from "@src/database/models/Warn";
import { InfractionAction } from "@src/database/structures/InfractionActions";
import { createErrorLog } from "@src/scripts/Logger";
import { MuteService } from "@src/common/modules/moderation/service/MuteService";
import { GuildMember, Message } from "discord.js";
import max from "lodash/max";

export default class WarnCommand extends AbstractMassMentionableUserModerationCommand {
    public static readonly options = <CommandOptions>{
        ...AbstractBaseCommand.options,
        name: "warn",
        group: "moderation",
        memberPermissions: ["KICK_MEMBERS"],
        clientPermissions: [
            "KICK_MEMBERS",
            "BAN_MEMBERS",
            "MANAGE_ROLES"
        ],
        disableBots: true
    };

    private readonly muteService: MuteService = new MuteService(this.commandData.message.guild, this.commandData.guildDaoManager);

    protected async execute(message: Message, args: string[]): Promise<void> {
        const reason: string = this.restArgs.length > 0 ? this.restArgs.join(" ").trim() : null;

        const warned: GuildMember[] = [];
        const punished: PunishmentInterface[] = [];

        let guildHighestCase: number = max([...(await Warn.findAll({
            where: {
                guildID: message.guild.id
            }
        }))
            .map(e => e.guildCaseID)]);

        for (const member of this.members) {
            await Warn.create({
                userID: member.id,
                invokerID: message.author.id,
                guildID: message.guild.id,
                guildCaseID: guildHighestCase += 1,
                reason: reason,
                timestamp: Math.floor(new Date().getTime() / 1000),
                duration: this.duration?.num
            });

            await this.sendResponseToUser(member.user, "warn", {
                reason: reason,
                invoker: message.member,
                duration: this.duration?.num
            })
                .catch(e => createErrorLog(e, __filename, false));

            warned.push(member);

            const memberWarnsCount: number = await Warn.count({
                where: {
                    userID: member.id,
                    guildID: member.guild.id
                }
            });

            const infractionActions: InfractionAction[] = this.commandData.guildData.infractionActions;
            const highestWarnLevel: number = WarnCommand.getInfractionsHighestWarnLevel(infractionActions);

            let punishmentSucceeded: boolean = false;

            if (infractionActions.length > 0) {
                for (const value of Object.values(infractionActions)) {
                    switch (value.type) {
                        case "kick": {
                            punished.push({member: member, type: value.type});

                            await member.kick(this.languageRecord.command.warn.kickReason)
                                .then(() => {
                                    punishmentSucceeded = true
                                })
                                .catch(e => createErrorLog(e, __filename));

                            await this.sendResponseToUser(member.user, "kick", {
                                invoker: message.member,
                                duration: null,
                                reason: reason
                            })
                                .catch(e => createErrorLog(e, __filename, false));

                            break;
                        }
                        case "ban": {
                            await Ban.create({
                                userID: member.id,
                                invokerID: message.author.id,
                                guildID: message.guild.id,
                                reason: this.languageRecord.command.ban.banReason,
                                timestamp: Math.floor(new Date().getTime() / 1000),
                                duration: value.duration
                            });

                            await this.sendResponseToUser(member.user, "ban", {
                                reason: reason,
                                invoker: message.member,
                                duration: value.duration
                            })
                                .catch(e => createErrorLog(e, __filename, false));

                            punished.push({member: member, type: value.type});

                            await member.ban({reason: this.languageRecord.command.ban.banReason})
                                .then(() => {
                                    punishmentSucceeded = true
                                })
                                .catch(e => createErrorLog(e, __filename));

                            break;
                        }
                        case "mute": {
                            try {
                                await this.muteService.muteMember({
                                    member: member,
                                    invoker: message.member,
                                    reason: this.languageRecord.command.mute.muteReason,
                                    duration: value.duration
                                })
                                    .then(() => {
                                        punishmentSucceeded = true
                                    })
                                    .catch(() => null);

                                await this.sendResponseToUser(member.user, "mute", {
                                    reason: reason,
                                    invoker: message.member,
                                    duration: value.duration
                                })
                                    .catch(e => createErrorLog(e, __filename, false));
                            } catch (e) {
                            }

                            break;
                        }
                    }
                }
            }

            if (punishmentSucceeded) {
                if (this.commandData.guildData.resetWarnsOnPunishment || (highestWarnLevel !== -1 && memberWarnsCount === highestWarnLevel)) {
                    await Warn.destroy({
                        where: {
                            userID: member.id,
                            guildID: member.guild.id
                        }
                    });
                }
            }
        }

        if (warned.length > 0) {
            this.moderationMessageBuilder.setActionDescription(this.languageRecord.command.warn.successResponse);
            this.moderationMessageBuilder.setTargetUsers(warned);

            if (punished.length > 0) {
                this.moderationMessageBuilder.messageEmbed.description += "\n\n";

                this.moderationMessageBuilder.setActionDescription(this.languageRecord.command.warn.additionalPunishment);

                for (const data of punished) {
                    switch (data.type) {
                        case "kick": {
                            this.moderationMessageBuilder.messageEmbed.description += data.member.toString() + " " + this.languageRecord.command.warn.hasBeenKicked + "\n";
                            break;
                        }
                        case "ban": {
                            this.moderationMessageBuilder.messageEmbed.description += data.member.toString() + " " + this.languageRecord.command.warn.hasBeenBanned + "\n";
                            break;
                        }
                    }
                }
            }

            this.moderationMessageBuilder.setReason(reason);
            this.moderationMessageBuilder.setDuration(this.duration);
            await this.moderationMessageBuilder.sendMessage();
        } else {
            this.showHelp();
        }
    }

    private static getInfractionsHighestWarnLevel(infractionActions: InfractionAction[]): number {
        let warnLevel: number = -1;

        for (const value of Object.values(infractionActions)) {
            if (value.count > warnLevel) {
                warnLevel = value.count;
            }
        }

        return warnLevel;
    }
}
