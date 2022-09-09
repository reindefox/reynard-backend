import { hyperlink } from "@discordjs/builders";
import { color } from "@src/assets/json/colors";
import { AbstractEventOptions } from "@src/common/abstractions/event/interfaces/Event";
import { AbstractLoggingEvent } from "@src/common/abstractions/event/model/AbstractLoggingEvent";
import { GuildDaoManager } from "@src/database/dao/managers/GuildDaoManager";
import { FormatUtils } from "@src/global/utils/FormatUtils";
import { icons } from "@src/modules/logging/assets/json/icons";
import { GuildChannel, Message, TextChannel } from "discord.js";

export default class LogMessageUpdate extends AbstractLoggingEvent {
    public static readonly options: AbstractEventOptions = {
        keyName: "messageUpdate",
        name: "event.messageUpdate.name",
    };

    constructor(guildDaoManager: GuildDaoManager) {
        super(LogMessageUpdate.options, guildDaoManager);
    }

    protected async execute(oldMessage: Message, newMessage: Message): Promise<void> {
        if (!this.canContinueExecution(<GuildChannel>newMessage.channel, newMessage.author)) return;

        this.messageBuilder
            .setColor(color.blue)
            .setAuthor(this.translate("eventLogger.messageUpdate.name"), icons.messageUpdate)
            .setDescription(this.translate("eventLogger.messageUpdate.description"));

        this.messageBuilder.addField(this.translate("eventLogger.keyword.author"), this.logStringBuilder
            .addFieldLine(this.translate("eventLogger.keyword.author"), newMessage.author, false)
            .addFieldLine("ID", newMessage.author?.id)
            .addFieldLine(this.translate("eventLogger.keyword.tag"), newMessage.author?.tag)
            .build());
        this.messageBuilder.addField(this.translate("eventLogger.keyword.channel"), this.logStringBuilder
            .addFieldLine(this.translate("eventLogger.keyword.channel"), newMessage.channel, false)
            .addFieldLine("ID", newMessage.channel?.id)
            .addFieldLine(this.translate("eventLogger.keyword.name"), (<TextChannel>newMessage.channel).name)
            .build());
        this.messageBuilder.addField(this.translate("eventLogger.keyword.message"), this.logStringBuilder
            .addFieldLine("ID", newMessage.id)
            .addFieldLine(this.translate("eventLogger.keyword.link"), hyperlink(this.translate("eventLogger.keyword.clickMessage"),
                `https://discordapp.com/channels/${newMessage.guild.id}/${newMessage.channel.id}/${newMessage.id}`), false)
            .build());

        if (newMessage.content.length > 0) {
            this.messageBuilder.description += `\n\n▫ **${this.translate("eventLogger.messageUpdate.newContent")}:**\n\`\`\`${FormatUtils.formatContent(FormatUtils.sliceContent(newMessage.content, 850))}\`\`\`\n▫ **${this.translate("eventLogger.messageUpdate.oldContent")}:**\n\`\`\`${FormatUtils.formatContent(FormatUtils.sliceContent(oldMessage.content, 850))}\`\`\``;
        }

        await this.invokeEvent();
    }
}
