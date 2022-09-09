import { color } from "@src/assets/json/colors";
import { AbstractEventOptions } from "@src/common/abstractions/event/interfaces/Event";
import { AbstractLoggingEvent } from "@src/common/abstractions/event/model/AbstractLoggingEvent";
import { GuildDaoManager } from "@src/database/dao/managers/GuildDaoManager";
import { FormatUtils } from "@src/global/utils/FormatUtils";
import { icons } from "@src/modules/logging/assets/json/icons";
import { LogLineStringBuilder } from "@src/modules/logging/utils/LogLineStringBuilder";
import { GuildChannel, Message, TextChannel } from "discord.js";

export default class LogMessageDelete extends AbstractLoggingEvent {
    public static readonly options: AbstractEventOptions = {
        keyName: "messageDelete",
        name: "event.messageDelete.name",
    };

    constructor(guildDaoManager: GuildDaoManager) {
        super(LogMessageDelete.options, guildDaoManager);
    }

    protected async execute(message: Message): Promise<void> {
        if (!this.canContinueExecution(<GuildChannel>message.channel, message.author)) return;

        this.messageBuilder
            .setColor(color.red)
            .setAuthor(this.translate("eventLogger.messageDelete.name"), icons.messageDelete)
            .setDescription(this.translate("eventLogger.messageDelete.description"));
        this.messageBuilder.addField(this.translate("eventLogger.keyword.author"), this.logStringBuilder
            .addFieldLine(this.translate("eventLogger.keyword.author"), message.author, false)
            .addFieldLine("ID", message.author?.id)
            .addFieldLine(this.translate("eventLogger.keyword.tag"), message.author?.tag)
            .build());
        this.messageBuilder.addField(this.translate("eventLogger.keyword.channel"), this.logStringBuilder
            .addFieldLine(this.translate("eventLogger.keyword.channel"), message.channel, false)
            .addFieldLine("ID", message.channel?.id)
            .addFieldLine(this.translate("eventLogger.keyword.name"), (<TextChannel>message.channel).name)
            .build());

        const messageStringBuilder: LogLineStringBuilder = this.logStringBuilder;
        messageStringBuilder.addFieldLine("ID", message.id);
        if (message.content.length > 0) {
            this.messageBuilder.description += `\n\n▫ **${this.translate("eventLogger.messageDelete.content")}:**\n\`\`\`${FormatUtils.formatContent(FormatUtils.sliceContent(message.content, 1900))}\`\`\``;
        }
        if (message.attachments.size > 0) {
            messageStringBuilder.addFieldLine(this.translate("eventLogger.messageDelete.attachment"), message.attachments.first().url, false);
        }
        if (message.pinned) {
            messageStringBuilder.addFieldLine(this.translate("eventLogger.messageDelete.pinned"), this.translate("global." + message.pinned));
        }
        if (message.webhookId !== null) {
            messageStringBuilder.addFieldLine(this.translate("eventLogger.messageDelete.webhookID"), message.webhookId);
        }
        if (message.embeds.length > 0) {
            messageStringBuilder.addFieldLine(this.translate("eventLogger.messageDelete.embeds"), message.embeds.length);
        }
        if (message.reactions.cache.size > 0) {
            messageStringBuilder.addFieldLine(this.translate("eventLogger.messageDelete.reactions"), message.reactions.cache.map(e => e.emoji.name).join(" "));
        }
        messageStringBuilder.addFieldLine(this.translate("eventLogger.messageDelete.createdAt"), FormatUtils.getUTCTime(Number(message.createdAt)));
        this.messageBuilder.addField(this.translate("eventLogger.keyword.message"), messageStringBuilder.build());

        await this.invokeEvent();
    }
}
