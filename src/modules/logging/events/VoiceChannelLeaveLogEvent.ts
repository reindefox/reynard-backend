import { channelMention } from "@discordjs/builders";
import { color } from "@src/assets/json/colors";
import { AbstractEventOptions } from "@src/common/abstractions/event/interfaces/Event";
import { AbstractLoggingEvent } from "@src/common/abstractions/event/model/AbstractLoggingEvent";
import { GuildDaoManager } from "@src/database/dao/managers/GuildDaoManager";
import { icons } from "@src/modules/logging/assets/json/icons";
import { VoiceState } from "discord.js";

export default class LogVoiceChannelLeave extends AbstractLoggingEvent {
    public static readonly options: AbstractEventOptions = {
        keyName: "voiceChannelLeave",
        name: "event.voiceChannelLeave.name",
    };

    constructor(guildDaoManager: GuildDaoManager) {
        super(LogVoiceChannelLeave.options, guildDaoManager);
    }

    protected execute(oldState: VoiceState, newState: VoiceState): void | Promise<void> {
        if (!this.canContinueExecution(oldState.channel, oldState.member.user)) return;

        this.messageBuilder
            .setColor(color.red)
            .setAuthor(this.translate("eventLogger.voiceChannelLeave.name"), icons.memberRemove)
            .setDescription(this.translate("eventLogger.voiceChannelLeave.description"));

        this.messageBuilder.addField(this.translate("eventLogger.keyword.voiceChannel"), this.logStringBuilder
            .addFieldLine(this.translate("eventLogger.keyword.channel"), channelMention(oldState.channelId), false)
            .addFieldLine("ID", oldState.channelId)
            .addFieldLine(this.translate("eventLogger.keyword.name"), oldState.channel.name)
            .build());

        this.messageBuilder.addField(this.translate("eventLogger.keyword.member"), this.logStringBuilder
            .addFieldLine(this.translate("eventLogger.keyword.member"), oldState.member, false)
            .addFieldLine("ID", oldState.member.id)
            .addFieldLine(this.translate("eventLogger.keyword.tag"), oldState.member.user.tag)
            .build());

        void this.invokeEvent();
    }
}
