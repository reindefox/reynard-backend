import { AbstractEventOptions } from "@src/common/abstractions/event/interfaces/Event";
import { AbstractEvent } from "@src/common/abstractions/event/model/AbstractEvent";
import { VoiceState } from "discord.js";

export default class VoiceStateUpdateEvent extends AbstractEvent {
    public static readonly options: AbstractEventOptions = {
        keyName: "voiceStateUpdate",
        name: "event.voiceStateUpdate.name",
        category: "event.category.voice"
    };

    constructor() {
        super(VoiceStateUpdateEvent.options);
    }

    public async run(oldState: VoiceState, newState: VoiceState): Promise<void> {
        if (!oldState || !newState) return;

        if (oldState.selfDeaf !== newState.selfDeaf
            || oldState.selfMute !== newState.selfMute
            || oldState.selfVideo !== newState.selfVideo
            || oldState.streaming !== newState.streaming) return;

        /* Connect or disconnect */
        if (newState.channel && !oldState.channel || !newState.channel && oldState.channel) {
            /* Connect */
            if (newState.channel) {
                await this.initializeByName("voiceChannelJoin", newState.guild, ...arguments);
            } /* Disconnect */
            else if (oldState.channel) {
                await this.initializeByName("voiceChannelLeave", newState.guild, ...arguments);
            }
        } /* Switch */
        else if (newState.channel && oldState.channel && newState.channelId !== oldState.channelId) {
            await this.initializeByName("voiceChannelSwitch", newState.guild, ...arguments);
        } /* Miscellaneous updates */
        else {
            /**
             * @unused
             * */
            // this.client.emit(ModulesLoader.moduleName + this.eventOptions.keyName,
            //     this.eventOptions, this.guildDaoManager, ...arguments);
        }
    }
}
