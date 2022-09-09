import { CommandOptions } from "@src/common/abstractions/command/interfaces/Command";
import { AbstractBaseCommand } from "@src/common/abstractions/command/model/AbstractBaseCommand";
import { AbstractMassMentionableUserModerationCommand } from "@src/common/abstractions/command/model/AbstractMassMentionableUserModerationCommand";
import { Mute, MuteModel } from "@src/database/models/Mute";
import { createErrorLog } from "@src/scripts/Logger";
import { SystemMessageType } from "@src/common/command/service/MessageService";
import { GuildMember, Message, Role } from "discord.js";

export default class UnmuteCommand extends AbstractMassMentionableUserModerationCommand {
    public static readonly options = <CommandOptions>{
        ...AbstractBaseCommand.options,
        name: "unmute",
        group: "moderation",
        memberPermissions: ["MUTE_MEMBERS", "DEAFEN_MEMBERS"],
        clientPermissions: ["MANAGE_ROLES"],
        memberEveryPermission: false,
        selfMention: false,
        requiresDbQuery: false,
        disableBots: true,
        mentionsLimit: 1,
    };

    protected async execute(message: Message, args: string[]): Promise<void> {
        const target: GuildMember = this.members[0];

        const reason: string = this.restArgs?.join(" ") || null;

        const mute: MuteModel = await Mute.findOne({
            where: {
                guildID: message.guild.id,
                userID: target.user.id
            }
        });

        if (mute) {
            await mute.destroy();
        }

        const expectedMuteRole: Role = message.guild.roles.cache.get(mute?.muteRoleID)
            || message.guild.roles.cache.get(this.commandData.guildData.muteRoleID);

        if (expectedMuteRole) {
            if (target.roles.cache.has(expectedMuteRole.id)) {
                await target.roles.remove(expectedMuteRole, reason)
                    .catch(e => createErrorLog(e, __filename));

                this.moderationMessageBuilder.setActionDescription(this.translate("command.unmute.unmuted", [target.toString()]));
                this.moderationMessageBuilder.setReason(reason);
                await this.moderationMessageBuilder.sendMessage();
            } else {
                await this.messageService.sendSystemMessage(this.translate("command.unmute.notMuted", [target.toString()]), SystemMessageType.ERROR);
            }
        }
    }
}
