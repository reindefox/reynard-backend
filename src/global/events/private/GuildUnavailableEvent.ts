import { AbstractEventOptions } from "@src/common/abstractions/event/interfaces/Event";
import { AbstractEvent } from "@src/common/abstractions/event/model/AbstractEvent";
import { Guild } from "discord.js";

export default class GuildUnavailableEvent extends AbstractEvent {
    public static readonly options: AbstractEventOptions = {
        keyName: "guildUnavailable",
    };

    constructor() {
        super(GuildUnavailableEvent.options);
    }

    public async run(guild: Guild): Promise<void> {
        console.log(`${guild.name} (${guild.id}) is unavailable`);
    }
}
