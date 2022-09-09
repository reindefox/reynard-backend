import { channelMention } from "@discordjs/builders";
import { color } from "@src/assets/json/colors";
import { AbstractEventOptions } from "@src/common/abstractions/event/interfaces/Event";
import { AbstractLoggingEvent } from "@src/common/abstractions/event/model/AbstractLoggingEvent";
import { GuildDaoManager } from "@src/database/dao/managers/GuildDaoManager";
import { icons } from "@src/modules/logging/assets/json/icons";
import { VoiceState } from "discord.js";

export default class LogVoiceChannelJoin extends AbstractLoggingEvent {
    public static readonly options: AbstractEventOptions = {
        keyName: "voiceChannelJoin",
        name: "event.voiceChannelJoin.name",
    };

    constructor(guildDaoManager: GuildDaoManager) {
        super(LogVoiceChannelJoin.options, guildDaoManager);
    }

    protected execute(oldState: VoiceState, newState: VoiceState): void | Promise<void> {
        if (!this.canContinueExecution(newState.channel, newState.member.user)) return;

        this.messageBuilder
            .setColor(color.green)
            .setAuthor(this.translate("eventLogger.voiceChannelJoin.name"), icons.memberJoin)
            .setDescription(this.translate("eventLogger.voiceChannelJoin.description"));

        this.messageBuilder.addField(this.translate("eventLogger.keyword.voiceChannel"), this.logStringBuilder
            .addFieldLine(this.translate("eventLogger.keyword.channel"), channelMention(newState.channelId), false)
            .addFieldLine("ID", newState.channelId)
            .addFieldLine(this.translate("eventLogger.keyword.name"), newState.channel.name)
            .build());

        this.messageBuilder.addField(this.translate("eventLogger.keyword.member"), this.logStringBuilder
            .addFieldLine(this.translate("eventLogger.keyword.member"), newState.member, false)
            .addFieldLine("ID", newState.member.id)
            .addFieldLine(this.translate("eventLogger.keyword.tag"), newState.member.user.tag)
            .build());

        void this.invokeEvent();
    }
}
