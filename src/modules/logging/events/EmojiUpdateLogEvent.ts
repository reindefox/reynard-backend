import { color } from "@src/assets/json/colors";
import { AbstractEventOptions } from "@src/common/abstractions/event/interfaces/Event";
import { AbstractLoggingEvent } from "@src/common/abstractions/event/model/AbstractLoggingEvent";
import { GuildDaoManager } from "@src/database/dao/managers/GuildDaoManager";
import { icons } from "@src/modules/logging/assets/json/icons";
import { LineType } from "@src/modules/logging/utils/LogLineStringBuilder";
import { GuildAuditLogs, GuildEmoji } from "discord.js";

export default class LogEmojiUpdate extends AbstractLoggingEvent {
    public static readonly options: AbstractEventOptions = {
        keyName: "emojiUpdate",
        name: "event.emojiUpdate.name",
    };

    constructor(guildDaoManager: GuildDaoManager) {
        super(LogEmojiUpdate.options, guildDaoManager);
    }

    protected async execute(oldEmoji: GuildEmoji, newEmoji: GuildEmoji): Promise<void> {
        const audit: GuildAuditLogs = await this.fetchAuditLogs(newEmoji.guild, "EMOJI_UPDATE");

        if (!this.canContinueExecution(null, audit?.entries.first().executor)) return;

        this.messageBuilder
            .setColor(color.blue)
            .setAuthor(this.translate("eventLogger.emojiUpdate.name"), icons.emojiUpdate)
            .setDescription(this.translate("eventLogger.emojiUpdate.description"));

        this.messageBuilder.addField(this.translate("eventLogger.keyword.emoji"), this.logStringBuilder
            .addFieldLine(this.translate("eventLogger.keyword.emoji"), newEmoji, false)
            .addFieldLine(this.translate("eventLogger.keyword.name"), newEmoji.name)
            .addFieldLine("ID", newEmoji.id)
            .build());

        if (newEmoji.name !== oldEmoji.name) {
            this.messageBuilder.addField(this.translate("eventLogger.keyword.nameUpdate"), this.logStringBuilder
                .addFieldLineProperty(LineType.NEW, newEmoji.name)
                .addFieldLineProperty(LineType.OLD, oldEmoji.name)
                .build());
        }

        this.messageBuilder.setEventExecutor(audit);

        await this.invokeEvent();
    }
}
