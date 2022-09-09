import { CommandOptions } from "@src/common/abstractions/command/interfaces/Command";
import { AbstractBaseCommand } from "@src/common/abstractions/command/model/AbstractBaseCommand";
import { AbstractMassMentionableUserModerationCommand } from "@src/common/abstractions/command/model/AbstractMassMentionableUserModerationCommand";
import { createErrorLog } from "@src/scripts/Logger";
import { SystemMessageType } from "@src/common/command/service/MessageService";
import { MuteModerationActionRequest } from "@src/common/modules/moderation/interfaces/ModerationActionRequest";
import { MuteService } from "@src/common/modules/moderation/service/MuteService";
import { GuildMember, Message } from "discord.js";

export default class MuteCommand extends AbstractMassMentionableUserModerationCommand {
    public static readonly options = <CommandOptions>{
        ...AbstractBaseCommand.options,
        name: "mute",
        group: "moderation",
        memberPermissions: ["MUTE_MEMBERS", "DEAFEN_MEMBERS"],
        clientPermissions: ["MANAGE_ROLES"],
        memberEveryPermission: false,
        disableBots: true,
    };

    protected readonly muteService: MuteService = new MuteService(this.commandData.message.guild, this.commandData.guildDaoManager);

    protected async execute(message: Message, args: string[]): Promise<void> {
        const reason: string = this.restArgs.length > 0 ? this.restArgs.join(" ").trim() : null;

        const muted: GuildMember[] = [];

        for (const member of this.members) {
            try {
                const moderationActionRequest: MuteModerationActionRequest = {
                    member: member,
                    invoker: message.member,
                    reason: reason,
                    duration: this.duration?.num
                };

                await this.muteService.muteMember(moderationActionRequest)
                    .catch(() => null);

                this.sendResponseToUser(member.user, "mute", moderationActionRequest)
                    .catch(e => createErrorLog(e, __filename, false));
            } catch (e) {
                switch (e.message) {
                    case "MANAGEABLE_MUTE_ROLE": {
                        await this.messageService.sendSystemMessage(this.languageRecord.command.mute.muteRoleNotFound, SystemMessageType.ERROR);
                        return;
                    }
                }
            }

            muted.push(member);
        }

        if (muted.length > 0) {
            this.moderationMessageBuilder.setActionDescription(this.languageRecord.command.mute.successResponse);
            this.moderationMessageBuilder.setTargetUsers(muted);
            this.moderationMessageBuilder.setReason(reason);
            this.moderationMessageBuilder.setDuration(this.duration);
            await this.moderationMessageBuilder.sendMessage();
        } else {
            this.showHelp();
        }
    }
}
