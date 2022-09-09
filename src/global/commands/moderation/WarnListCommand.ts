import { CommandOptions } from "@src/common/abstractions/command/interfaces/Command";
import { AbstractBaseCommand } from "@src/common/abstractions/command/model/AbstractBaseCommand";
import { AbstractMentionableUserCommand } from "@src/common/abstractions/command/model/AbstractMentionableUserCommand";
import { Warn, WarnModel } from "@src/database/models/Warn";
import { NumberFormatUtils } from "@src/utils/NumberFormatUtils";
import { WarnListPagination } from "@src/common/command/WarnListCommand/WarnListPagination";
import { Message, MessageEmbed } from "discord.js";

export default class WarnListCommand extends AbstractMentionableUserCommand {
    public static readonly options = <CommandOptions>{
        ...AbstractBaseCommand.options,
        name: "warns",
        group: "moderation",
        memberPermissions: ["KICK_MEMBERS"],
        clientPermissions: [],
        disableBots: true
    };

    private static readonly maxWarningsPerPage: number = 10;

    protected async execute(message: Message, args: string[]): Promise<void> {
        const pageNumber: number = NumberFormatUtils.parseInt(this.restArgs[0]) || 1;

        const warnings: WarnModel[] = await Warn.findAll({
            where: {
                userID: this.member.id,
                guildID: message.guild.id
            }
        });

        await new WarnListPagination(warnings, this, {
            ...this.messageService.prepareEmbedMessage(new MessageEmbed()),
            author: {
                name: this.localeService.translate("command.warns.total", [this.member.displayName, warnings.length])
            }
        }, WarnListCommand.maxWarningsPerPage, pageNumber)
            .createPaginationComponent();
    }
}
