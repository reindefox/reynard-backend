import { CommandOptions } from "@src/common/abstractions/command/interfaces/Command";
import { AbstractBaseCommand } from "@src/common/abstractions/command/model/AbstractBaseCommand";
import { AbstractMentionableUserCommand } from "@src/common/abstractions/command/model/AbstractMentionableUserCommand";
import { MomentService } from "@src/services/guild/MomentService";
import { LineStringBuilder } from "@src/utils/LineStringBuilder";
import { ActivityType, Message, MessageEmbed } from "discord.js";

export default class UserCommand extends AbstractMentionableUserCommand {
    public static readonly options = <CommandOptions>{
        ...AbstractBaseCommand.options,
        name: "user",
        group: "utilities",
        clientPermissions: [],
        memberPermissions: []
    };

    protected async execute(message: Message, args: string[]): Promise<void> {
        let memberStatusIcon: string;

        if (this.languageRecord.presenceStatus[this.member.presence?.status || "offline"]) {
            memberStatusIcon = this.languageRecord.presenceStatus[this.member.presence?.status || "offline"];
        } else {
            memberStatusIcon = this.languageRecord.presenceStatus.unknown;
        }

        const messageEmbed: MessageEmbed = new MessageEmbed();
        messageEmbed
            .setAuthor(this.localeService.translate("command.user.about", [this.member.displayName]))
            .setThumbnail(this.member.user.displayAvatarURL())
            .setFooter("ID: " + this.member.id);

        let customStatusString: string = "";

        if (this.member.presence?.activities[0]?.emoji?.name) {
            customStatusString += this.member.presence.activities[0].emoji.name + " ";
        }

        if (this.member.presence?.activities[0]?.state) {
            customStatusString += this.member.presence.activities[0].state + " ";
        }

        const commonBuilder: LineStringBuilder = new LineStringBuilder();
        commonBuilder
            .addFieldLine(this.languageRecord.command.user.username, this.member.user.tag)
            .addFieldLine(this.languageRecord.command.user.status, memberStatusIcon)
            .addFieldLine(this.languageRecord.command.user.customStatus, customStatusString.trim());

        const activityType: ActivityType = this.member.presence?.activities[0]?.type;

        if (activityType !== "CUSTOM") {
            commonBuilder.addFieldLine(this.languageRecord.activityType[this.member.presence?.activities[0]?.type], this.member.presence?.activities[0]?.name);
        }

        commonBuilder
            .addFieldLine(this.languageRecord.command.user.joinedAt, this.moment(this.member.joinedAt).format(MomentService.defaultFormat))
            .addFieldLine(this.languageRecord.command.user.registered, this.moment(this.member.user.createdAt).format(MomentService.defaultFormat));

        messageEmbed.addField(this.languageRecord.command.user.common, commonBuilder.build());

        await this.messageService.sendEmbedMessage(messageEmbed);
    }
}
