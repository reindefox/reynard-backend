import { color } from "@src/assets/json/colors";
import { AbstractEventOptions } from "@src/common/abstractions/event/interfaces/Event";
import { AbstractLoggingEvent } from "@src/common/abstractions/event/model/AbstractLoggingEvent";
import { GuildDaoManager } from "@src/database/dao/managers/GuildDaoManager";
import { icons } from "@src/modules/logging/assets/json/icons";
import { Collection, GuildChannel, Message, Snowflake, TextChannel } from "discord.js";

export default class LogMessageDeleteBulk extends AbstractLoggingEvent {
    public static readonly options: AbstractEventOptions = {
        keyName: "messageDeleteBulk",
        name: "event.messageDeleteBulk.name",
    };

    constructor(guildDaoManager: GuildDaoManager) {
        super(LogMessageDeleteBulk.options, guildDaoManager);
    }

    protected async execute(messages: Collection<Snowflake, Message>): Promise<void> {
        const messagesMap: Message[] = messages.map(m => m);

        if (!this.canContinueExecution(<GuildChannel>messagesMap[0]?.channel, null)) return;

        this.messageBuilder
            .setColor(color.red)
            .setAuthor(this.translate("eventLogger.messageDeleteBulk.name"), icons.messageDelete)
            .setDescription(this.translate("eventLogger.messageDeleteBulk.description", [messages.size]));

        this.messageBuilder.addField(this.translate("eventLogger.keyword.channel"), this.logStringBuilder
            .addFieldLine(this.translate("eventLogger.keyword.channel"), messagesMap[0].channel, false)
            .addFieldLine("ID", messagesMap[0].channel.id)
            .addFieldLine(this.translate("eventLogger.keyword.name"), (<TextChannel>messagesMap[0].channel).name)
            .build());

        await this.invokeEvent();
    }
}
