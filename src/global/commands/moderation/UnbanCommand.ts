import { CommandOptions } from "@src/common/abstractions/command/interfaces/Command";
import { AbstractBaseCommand } from "@src/common/abstractions/command/model/AbstractBaseCommand";
import { AbstractModerationCommand } from "@src/common/abstractions/command/model/AbstractModerationCommand";
import { createErrorLog } from "@src/scripts/Logger";
import { SystemMessageType } from "@src/common/command/service/MessageService";
import { Collection, GuildBan, Message, Snowflake } from "discord.js";

export default class UnbanCommand extends AbstractModerationCommand {
    public static readonly options = <CommandOptions>{
        ...AbstractBaseCommand.options,
        name: "unban",
        group: "moderation",
        memberPermissions: ["BAN_MEMBERS"],
        clientPermissions: ["MANAGE_GUILD"],
        disableBots: true,
    };

    protected async execute(message: Message, args: string[]): Promise<void> {
        if (!args[0]) {
            this.showHelp();
            return;
        }

        const expectedUser: string = args[0].toLowerCase();
        const reason: string = args.slice(1).join(" ") || null;

        const guildBans: Collection<Snowflake, GuildBan> = message.guild.bans.cache;

        const banInfo: GuildBan = guildBans.find(r =>
            r.user.id === UnbanCommand.extractID(expectedUser)
            || r.user.tag.toLowerCase() === expectedUser
            || r.user.username.toLowerCase() === expectedUser);

        if (!banInfo) {
            await this.messageService.sendSystemMessage(this.languageRecord.command.unban.memberNotFound, SystemMessageType.ERROR);
            return;
        }

        await message.guild.members.unban(banInfo.user.id, reason)
            .catch(e => createErrorLog(e, __filename));

        this.moderationMessageBuilder.setActionDescription(this.translate("command.unban.unbanned", [banInfo.user.toString()]));
        this.moderationMessageBuilder.setReason(reason);
        await this.moderationMessageBuilder.sendMessage();
    }
}

