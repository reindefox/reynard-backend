import { AbstractEventOptions } from "@src/common/abstractions/event/interfaces/Event";
import { AbstractLoggingEvent } from "@src/common/abstractions/event/model/AbstractLoggingEvent";
import { GuildDaoManager } from "@src/database/dao/managers/GuildDaoManager";
import { VoiceState } from "discord.js";

/**
 * @unused
 * */
export default class LogVoiceStateUpdate extends AbstractLoggingEvent {
    public static readonly options: AbstractEventOptions = {
        keyName: "voiceStateUpdate",
        name: "event.voiceStateUpdate.name",
    };

    constructor(guildDaoManager: GuildDaoManager) {
        super(LogVoiceStateUpdate.options, guildDaoManager);
    }

    protected async execute(oldState: VoiceState, newState: VoiceState): Promise<void> {
        // if (!this.canContinueExecution(newState.channel || oldState.channel, null)) return;
        //
        // this.messageBuilder
        //     .setColor(color.blue)
        //     .setDescription(this.translate("eventLogger.voiceStateUpdate.description"));
        //
        // await this.invokeEvent();
    }
}
