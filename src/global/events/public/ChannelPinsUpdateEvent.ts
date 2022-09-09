import { AbstractEventOptions } from "@src/common/abstractions/event/interfaces/Event";
import { AbstractEvent } from "@src/common/abstractions/event/model/AbstractEvent";
import { TextChannel } from "discord.js";

export default class ChannelPinsUpdateEvent extends AbstractEvent {
    public static readonly options: AbstractEventOptions = {
        keyName: "channelPinsUpdate",
        name: "event.channelPinsUpdate.name",
        category: "event.category.channel"
    };

    constructor() {
        super(ChannelPinsUpdateEvent.options);
    }

    public async run(channel: TextChannel, time: Date): Promise<void> {
        if (!channel || !time) return;
        if (!channel.guild) return;

        await this.initialize(channel.guild, ...arguments);
    }
}
