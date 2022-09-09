import { userMention } from "@discordjs/builders";
import { WarnModel } from "@src/database/models/Warn";
import { MomentService } from "@src/services/guild/MomentService";
import { ButtonPagination } from "@src/common/command/ButtonPagination";
import { MessageEmbed } from "discord.js";

export class WarnListPagination extends ButtonPagination<WarnModel> {
    protected createPageElement(warning: WarnModel, messageEmbed: MessageEmbed): void {
        messageEmbed.description += `**\`#${warning.guildCaseID}\` UTC ${this.command.moment(warning.timestamp, "X").format(MomentService.defaultFormat)}**`;

        if (warning.invokerID) {
            messageEmbed.description += ` ${userMention(warning.invokerID)}`;
        }

        if (warning.reason) {
            messageEmbed.description += `\n${this.command.languageRecord.command.reason}: ${warning.reason}`;
        }

        if (warning.duration) {
            const until: number = warning.timestamp + warning.duration;

            messageEmbed.description += `\n${this.command.languageRecord.command.until}: ${this.command.moment(until, "X").format(MomentService.defaultFormat)}`;
        }
    }
}
