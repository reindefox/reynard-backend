import { color } from "@src/assets/json/colors";
import { AbstractEventOptions } from "@src/common/abstractions/event/interfaces/Event";
import { AbstractLoggingEvent } from "@src/common/abstractions/event/model/AbstractLoggingEvent";
import { GuildDaoManager } from "@src/database/dao/managers/GuildDaoManager";
import { icons } from "@src/modules/logging/assets/json/icons";
import { LoggingUtils } from "@src/modules/logging/utils/LoggingUtils";
import { GuildAuditLogs, GuildChannel } from "discord.js";

export default class LogChannelDelete extends AbstractLoggingEvent {
    public static readonly options: AbstractEventOptions = {
        keyName: "channelDelete",
        name: "event.channelDelete.name"
    };

    constructor(guildDaoManager: GuildDaoManager) {
        super(LogChannelDelete.options, guildDaoManager);
    }

    protected async execute(channel: GuildChannel): Promise<void> {
        const audit: GuildAuditLogs = await this.fetchAuditLogs(channel.guild, "CHANNEL_DELETE");

        if (!this.canContinueExecution(null, audit?.entries.first().executor)) return;

        this.messageBuilder
            .setColor(color.red)
            .setAuthor(this.translate("eventLogger.channelDelete.name"), icons.channelDelete)
            .setDescription(this.translate("eventLogger.channelDelete.description"));

        this.messageBuilder.addField(this.translate("eventLogger.keyword.channel"), this.logStringBuilder
            .addFieldLine("ID", channel.id)
            .addFieldLine(this.translate("eventLogger.keyword.name"), channel.name)
            .addFieldLine(this.translate("eventLogger.keyword.type"), channel.type)
            .build());

        this.messageBuilder.setEventExecutor(audit);

        if (channel.permissionOverwrites.cache.size > 1) {
            LoggingUtils.getChannelPermissions(channel, this.messageBuilder, this.guildDaoManager);
        }

        await this.invokeEvent();
    }
}
