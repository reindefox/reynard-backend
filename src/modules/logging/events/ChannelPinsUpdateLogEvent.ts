import { color } from "@src/assets/json/colors";
import { AbstractEventOptions } from "@src/common/abstractions/event/interfaces/Event";
import { AbstractLoggingEvent } from "@src/common/abstractions/event/model/AbstractLoggingEvent";
import { GuildDaoManager } from "@src/database/dao/managers/GuildDaoManager";
import { icons } from "@src/modules/logging/assets/json/icons";
import { TextChannel } from "discord.js";

export default class LogChannelPinsUpdate extends AbstractLoggingEvent {
    public static readonly options: AbstractEventOptions = {
        keyName: "channelPinsUpdate",
        name: "event.channelPinsUpdate.name"
    };

    constructor(guildDaoManager: GuildDaoManager) {
        super(LogChannelPinsUpdate.options, guildDaoManager);
    }

    protected async execute(channel: TextChannel, time: Date): Promise<void> {
        if (!this.canContinueExecution(channel, null)) return;

        this.messageBuilder
            .setColor(color.blue)
            .setAuthor(this.translate("eventLogger.channelPinsUpdate.name"), icons.messageUpdate)
            .setDescription(this.translate("eventLogger.channelPinsUpdate.description"));

        this.messageBuilder.addField(this.translate("eventLogger.keyword.channel"), this.logStringBuilder
            .addFieldLine(this.translate("eventLogger.keyword.channel"), channel, false)
            .addFieldLine("ID", channel.id)
            .addFieldLine(this.translate("eventLogger.keyword.name"), channel.name)
            .build());

        await this.invokeEvent();
    }
}
