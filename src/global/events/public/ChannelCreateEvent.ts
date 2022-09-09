import { AbstractEventOptions } from "@src/common/abstractions/event/interfaces/Event";
import { AbstractEvent } from "@src/common/abstractions/event/model/AbstractEvent";
import { GuildChannel } from "discord.js";

export default class ChannelCreateEvent extends AbstractEvent {
    public static readonly options: AbstractEventOptions = {
        keyName: "channelCreate",
        name: "event.channelCreate.name",
        category: "event.category.channel"
    };

    constructor() {
        super(ChannelCreateEvent.options);
    }

    public async run(channel: GuildChannel): Promise<void> {
        if (!channel) return;
        if (!channel.guild) return;

        await this.initialize(channel.guild, ...arguments);
    }
}
