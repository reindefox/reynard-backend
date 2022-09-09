import { color } from "@src/assets/json/colors";
import { AbstractEventOptions } from "@src/common/abstractions/event/interfaces/Event";
import { AbstractLoggingEvent } from "@src/common/abstractions/event/model/AbstractLoggingEvent";
import { GuildDaoManager } from "@src/database/dao/managers/GuildDaoManager";
import { icons } from "@src/modules/logging/assets/json/icons";
import { GuildAuditLogs, GuildEmoji } from "discord.js";

export default class LogEmojiCreate extends AbstractLoggingEvent {
    public static readonly options: AbstractEventOptions = {
        keyName: "emojiCreate",
        name: "event.emojiCreate.name",
    };

    constructor(guildDaoManager: GuildDaoManager) {
        super(LogEmojiCreate.options, guildDaoManager);
    }

    protected async execute(emoji: GuildEmoji): Promise<void> {
        const audit: GuildAuditLogs = await this.fetchAuditLogs(emoji.guild, "EMOJI_CREATE");

        if (!this.canContinueExecution(null, audit?.entries.first().executor)) return;

        this.messageBuilder
            .setColor(color.green)
            .setAuthor(this.translate("eventLogger.emojiCreate.name"), icons.emojiCreate)
            .setDescription(this.translate("eventLogger.emojiCreate.description"));

        this.messageBuilder.addField(this.translate("eventLogger.keyword.emoji"), this.logStringBuilder
            .addFieldLine(this.translate("eventLogger.keyword.emoji"), emoji, false)
            .addFieldLine(this.translate("eventLogger.keyword.name"), emoji.name)
            .addFieldLine("ID", emoji.id)
            .addFieldLine(this.translate("eventLogger.keyword.animated"), emoji.animated)
            .build());

        this.messageBuilder.setEventExecutor(audit);

        await this.invokeEvent();
    }
}
