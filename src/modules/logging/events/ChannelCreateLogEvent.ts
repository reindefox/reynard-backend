import { color } from "@src/assets/json/colors";
import { AbstractEventOptions } from "@src/common/abstractions/event/interfaces/Event";
import { AbstractLoggingEvent } from "@src/common/abstractions/event/model/AbstractLoggingEvent";
import { GuildDaoManager } from "@src/database/dao/managers/GuildDaoManager";
import { icons } from "@src/modules/logging/assets/json/icons";
import { LoggingUtils } from "@src/modules/logging/utils/LoggingUtils";
import { GuildAuditLogs, GuildChannel } from "discord.js";

export default class LogChannelCreate extends AbstractLoggingEvent {
    public static readonly options: AbstractEventOptions = {
        keyName: "channelCreate",
        name: "event.channelCreate.name",
    };

    constructor(guildDaoManager: GuildDaoManager) {
        super(LogChannelCreate.options, guildDaoManager);
    }

    protected async execute(channel: GuildChannel): Promise<void> {
        const audit: GuildAuditLogs = await this.fetchAuditLogs(channel.guild, "CHANNEL_CREATE");

        if (!this.canContinueExecution(null, audit?.entries.first().executor)) return;

        this.messageBuilder
            .setColor(color.green)
            .setAuthor(this.languageRecord.eventLogger.channelCreate.name, icons.channelCreate)
            .setDescription(this.languageRecord.eventLogger.channelCreate.description);

        this.messageBuilder.addField(this.languageRecord.eventLogger.keyword.channel, this.logStringBuilder
            .addFieldLine(this.languageRecord.eventLogger.keyword.channel, channel, false)
            .addFieldLine("ID", channel.id)
            .addFieldLine(this.languageRecord.eventLogger.keyword.name, channel.name)
            .addFieldLine(this.languageRecord.eventLogger.keyword.type, channel.type)
            .addFieldLine(this.languageRecord.eventLogger.keyword.position, channel.position)
            .build());

        this.messageBuilder.setEventExecutor(audit);

        if (channel.permissionOverwrites.cache.size > 1) {
            LoggingUtils.getChannelPermissions(channel, this.messageBuilder, this.guildDaoManager);
        }

        await this.invokeEvent();
    }
}
