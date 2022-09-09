import { color } from "@src/assets/json/colors";
import { AbstractEventOptions } from "@src/common/abstractions/event/interfaces/Event";
import { AbstractLoggingEvent } from "@src/common/abstractions/event/model/AbstractLoggingEvent";
import { GuildDaoManager } from "@src/database/dao/managers/GuildDaoManager";
import { icons } from "@src/modules/logging/assets/json/icons";
import { GuildAuditLogs, GuildEmoji } from "discord.js";

export default class LogEmojiDelete extends AbstractLoggingEvent {
    public static readonly options: AbstractEventOptions = {
        keyName: "emojiDelete",
        name: "event.emojiDelete.name",
    };

    constructor(guildDaoManager: GuildDaoManager) {
        super(LogEmojiDelete.options, guildDaoManager);
    }

    protected async execute(emoji: GuildEmoji): Promise<void> {
        const audit: GuildAuditLogs = await this.fetchAuditLogs(emoji.guild, "EMOJI_DELETE");

        if (!this.canContinueExecution(null, audit?.entries.first().executor)) return;

        this.messageBuilder
            .setColor(color.red)
            .setAuthor(this.translate("eventLogger.channelUpdate.name"), icons.emojiDelete)
            .setDescription(this.translate("eventLogger.channelUpdate.description"));

        this.messageBuilder.addField(this.translate("eventLogger.keyword.emoji"), this.logStringBuilder
            .addFieldLine(this.translate("eventLogger.keyword.name"), emoji.name)
            .addFieldLine("ID", emoji.id)
            .build());

        this.messageBuilder.setEventExecutor(audit);

        await this.invokeEvent();
    }
}
