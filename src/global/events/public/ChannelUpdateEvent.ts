import { AbstractEventOptions } from "@src/common/abstractions/event/interfaces/Event";
import { AbstractEvent } from "@src/common/abstractions/event/model/AbstractEvent";
import { GuildChannel } from "discord.js";

export default class ChannelUpdateEvent extends AbstractEvent {
    public static readonly options: AbstractEventOptions = {
        keyName: "channelUpdate",
        name: "event.channelUpdate.name",
        category: "event.category.channel"
    };

    constructor() {
        super(ChannelUpdateEvent.options);
    }

    public async run(oldChannel: GuildChannel, newChannel: GuildChannel): Promise<void> {
        if (!oldChannel || !newChannel) return;
        if (!oldChannel.guild || !newChannel.guild) return;

        if (newChannel.rawPosition !== oldChannel.rawPosition) return;
        if (newChannel.position !== oldChannel.position) return;
        if (newChannel.parent !== oldChannel.parent) return;

        await this.initialize(newChannel.guild, ...arguments);
    }
}
