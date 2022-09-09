import { CommandOptions } from "@src/common/abstractions/command/interfaces/Command";
import { AbstractBaseCommand } from "@src/common/abstractions/command/model/AbstractBaseCommand";
import { AbstractMassMentionableUserModerationCommand } from "@src/common/abstractions/command/model/AbstractMassMentionableUserModerationCommand";
import { createErrorLog } from "@src/scripts/Logger";
import { NumberFormatUtils } from "@src/utils/NumberFormatUtils";
import { BanModerationActionRequest } from "@src/common/modules/moderation/interfaces/ModerationActionRequest";
import { BanService } from "@src/common/modules/moderation/service/BanService";
import { Message, User } from "discord.js";

export default class BanCommand extends AbstractMassMentionableUserModerationCommand {
    public static readonly options = <CommandOptions>{
        ...AbstractBaseCommand.options,
        name: "ban",
        group: "moderation",
        memberPermissions: ["BAN_MEMBERS"],
        clientPermissions: ["BAN_MEMBERS"],
        disableBots: true,
    };

    protected readonly banService: BanService = new BanService(this.commandData.message.guild, this.commandData.guildDaoManager);

    protected async execute(message: Message, args: string[]): Promise<void> {
        let deleteDays: number = NumberFormatUtils.parseInt(this.restArgs[0]);

        if (deleteDays !== null) {
            if (deleteDays < 1) {
                deleteDays = null;
            } else if (deleteDays > 7) {
                deleteDays = 7;
            }

            this.restArgs.shift();
        }

        const reason: string = this.restArgs.length > 0 ? this.restArgs.join(" ").trim() : null;

        const banned: User[] = [];

        for (const id of this.userIDList) {
            const moderationActionRequest: BanModerationActionRequest = {
                invoker: message.member,
                reason: reason,
                duration: this.duration?.num,
                userID: id,
                message: message,
                deleteDays: deleteDays
            };

            this.banService.banMember(moderationActionRequest)
                .then((u: User) => {
                    banned.push(u);

                    this.sendResponseToUser(u, "ban", moderationActionRequest)
                        .catch(e => createErrorLog(e, __filename, false));
                })
                .catch(e => createErrorLog(e, __filename));
        }

        if (banned.length > 0) {
            this.moderationMessageBuilder.setActionDescription(this.languageRecord.command.ban.successResponse);
            this.moderationMessageBuilder.setTargetUsers(banned);
            this.moderationMessageBuilder.setReason(reason);
            this.moderationMessageBuilder.setDuration(this.duration);
            await this.moderationMessageBuilder.sendMessage();
        } else {
            this.showHelp();
        }
    }
}
