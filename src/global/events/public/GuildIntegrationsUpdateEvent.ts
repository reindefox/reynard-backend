import { AbstractEventOptions } from "@src/common/abstractions/event/interfaces/Event";
import { AbstractEvent } from "@src/common/abstractions/event/model/AbstractEvent";
import { Guild } from "discord.js";

export default class GuildIntegrationsUpdateEvent extends AbstractEvent {
    public static readonly options: AbstractEventOptions = {
        keyName: "guildIntegrationsUpdate",
        name: "event.guildIntegrationsUpdate.name",
        category: "event.category.guild"
    };

    constructor() {
        super(GuildIntegrationsUpdateEvent.options);
    }

    public async run(guild: Guild): Promise<void> {
        if (!guild) return;

        await this.initialize(guild, ...arguments);
    }
}
