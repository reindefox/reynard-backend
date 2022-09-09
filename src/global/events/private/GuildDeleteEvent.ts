import { AbstractEventOptions } from "@src/common/abstractions/event/interfaces/Event";
import { AbstractEvent } from "@src/common/abstractions/event/model/AbstractEvent";
import { Guild } from "discord.js";

export default class GuildDeleteEvent extends AbstractEvent {
    public static readonly options: AbstractEventOptions = {
        keyName: "guildDelete",
    };

    constructor() {
        super(GuildDeleteEvent.options);
    }

    public async run(guild: Guild): Promise<void> {
        if (!guild) return;
    }
}
