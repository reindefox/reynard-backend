import { hyperlink } from "@discordjs/builders";
import { color } from "@src/assets/json/colors";
import { AbstractEventOptions } from "@src/common/abstractions/event/interfaces/Event";
import { AbstractLoggingEvent } from "@src/common/abstractions/event/model/AbstractLoggingEvent";
import { GuildDaoManager } from "@src/database/dao/managers/GuildDaoManager";
import { icons } from "@src/modules/logging/assets/json/icons";
import { GuildChannel, Message, TextChannel } from "discord.js";

export default class LogMessageReactionRemoveAll extends AbstractLoggingEvent {
    public static readonly options: AbstractEventOptions = {
        keyName: "messageReactionRemoveAll",
        name: "event.messageReactionRemoveAll.name",
    };

    constructor(guildDaoManager: GuildDaoManager) {
        super(LogMessageReactionRemoveAll.options, guildDaoManager);
    }

    protected async execute(message: Message): Promise<void> {
        if (!this.canContinueExecution(<GuildChannel>message.channel, null)) return;

        this.messageBuilder
            .setColor(color.red)
            .setAuthor(this.translate("eventLogger.messageReactionRemoveAll.name"), icons.emojiDelete)
            .setDescription(this.translate("eventLogger.messageReactionRemoveAll.description"));

        this.messageBuilder.addField(this.translate("eventLogger.keyword.channel"), this.logStringBuilder
            .addFieldLine(this.translate("eventLogger.keyword.channel"), message.channel, false)
            .addFieldLine("ID", message.channel?.id)
            .addFieldLine(this.translate("eventLogger.keyword.name"), (<TextChannel>message.channel)?.name)
            .build());

        this.messageBuilder.addField(this.translate("eventLogger.keyword.message"), this.logStringBuilder
            .addFieldLine("ID", message.id)
            .addFieldLine(this.translate("eventLogger.keyword.link"), hyperlink(this.translate("eventLogger.keyword.clickMessage"),
                `https://discordapp.com/channels/${message.guild.id}/${message.channel.id}/${message.id}`), false)
            .build());

        await this.invokeEvent();
    }
}
