import { userMention } from "@discordjs/builders";
import { CommandOptions } from "@src/common/abstractions/command/interfaces/Command";
import { AbstractBaseCommand } from "@src/common/abstractions/command/model/AbstractBaseCommand";
import { Warn, WarnModel } from "@src/database/models/Warn";
import { MomentService } from "@src/services/guild/MomentService";
import { NumberFormatUtils } from "@src/utils/NumberFormatUtils";
import { SystemMessageType } from "@src/common/command/service/MessageService";
import { Message } from "discord.js";
import moment from "moment";

export default class RemoveWarnCommand extends AbstractBaseCommand {
    public static readonly options = <CommandOptions>{
        ...AbstractBaseCommand.options,
        name: "remwarn",
        group: "moderation",
        memberPermissions: ["KICK_MEMBERS"],
        clientPermissions: [],
        disableBots: true
    };

    protected async execute(message: Message, args: string[]): Promise<void> {
        if (!args[0]) {
            this.showHelp();
            return;
        }

        const caseID: number = NumberFormatUtils.parseInt(args[0]);

        if (caseID === null || caseID < 1) {
            this.showHelp();
            return;
        }

        const warn: WarnModel = await Warn.findOne({
            where: {
                guildID: message.guild.id,
                guildCaseID: caseID
            }
        });

        if (!warn) {
            await this.messageService.sendSystemMessage(this.localeService.translate("command.remwarn.notFound", [caseID]), SystemMessageType.ERROR);
            return;
        }

        let warningInfo: string = `**${moment(warn.timestamp, "X").format(MomentService.defaultFormat)} ${userMention(warn.invokerID)}`;

        if (warn.reason) {
            warningInfo += `\n${warn.reason}`;
        }

        await warn.destroy();
        await this.messageService.sendSystemMessage(`${this.localeService.translate("command.remwarn.success", [caseID])}\n\n${warningInfo}`, SystemMessageType.SUCCESS);
    }
}
