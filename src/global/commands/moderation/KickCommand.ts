import { CommandOptions } from "@src/common/abstractions/command/interfaces/Command";
import { AbstractBaseCommand } from "@src/common/abstractions/command/model/AbstractBaseCommand";
import { AbstractMassMentionableUserModerationCommand } from "@src/common/abstractions/command/model/AbstractMassMentionableUserModerationCommand";
import { createErrorLog } from "@src/scripts/Logger";
import { GuildMember, Message } from "discord.js";

export default class KickCommand extends AbstractMassMentionableUserModerationCommand {
    public static readonly options = <CommandOptions>{
        ...AbstractBaseCommand.options,
        name: "kick",
        group: "moderation",
        memberPermissions: ["KICK_MEMBERS"],
        clientPermissions: ["KICK_MEMBERS"],
        disableBots: true
    };

    protected async execute(message: Message, args: string[]): Promise<void> {
        const reason: string = this.restArgs.length > 0 ? this.restArgs.join(" ").trim() : null;

        const kicked: GuildMember[] = [];

        for (const member of this.members) {
            try {
                await member.kick(reason)
                    .catch(e => createErrorLog(e, __filename));

                this.sendResponseToUser(member.user, "kick", {
                    invoker: message.member,
                    duration: null,
                    reason: reason
                })
                    .catch(e => createErrorLog(e, __filename, false));

                kicked.push(member);
            } catch (e) {
            }
        }

        if (kicked.length > 0) {
            this.moderationMessageBuilder.setActionDescription(this.languageRecord.command.kick.successResponse);
            this.moderationMessageBuilder.setTargetUsers(kicked);
            this.moderationMessageBuilder.setReason(reason);
            await this.moderationMessageBuilder.sendMessage();
        } else {
            this.showHelp();
        }
    }
}
