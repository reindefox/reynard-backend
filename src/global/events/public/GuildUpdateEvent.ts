import { AbstractEventOptions } from "@src/common/abstractions/event/interfaces/Event";
import { AbstractEvent } from "@src/common/abstractions/event/model/AbstractEvent";
import { Guild } from "discord.js";

export default class GuildUpdateEvent extends AbstractEvent {
    public static readonly options: AbstractEventOptions = {
        keyName: "guildUpdate",
        name: "event.guildUpdate.name",
        category: "event.category.guild"
    };

    constructor() {
        super(GuildUpdateEvent.options);
    }

    public async run(oldGuild: Guild, newGuild: Guild): Promise<void> {
        if (!oldGuild || !newGuild) return;
        if (newGuild.premiumTier !== oldGuild.premiumTier
            || newGuild.premiumSubscriptionCount !== oldGuild.premiumSubscriptionCount
            || newGuild.premiumTier !== oldGuild.premiumTier) return;

        await this.initialize(newGuild, ...arguments);
    }
}
