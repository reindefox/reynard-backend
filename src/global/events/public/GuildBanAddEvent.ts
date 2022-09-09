import { AbstractEventOptions } from "@src/common/abstractions/event/interfaces/Event";
import { AbstractEvent } from "@src/common/abstractions/event/model/AbstractEvent";
import { Guild, User } from "discord.js";

export default class GuildBanAddEvent extends AbstractEvent {
    public static readonly options: AbstractEventOptions = {
        keyName: "guildBanAdd",
        name: "event.guildBanAdd.name",
        category: "event.category.guild"
    };

    constructor() {
        super(GuildBanAddEvent.options);
    }

    public async run(guild: Guild, user: User): Promise<void> {
        if (!guild || !user) return;

        await this.initialize(guild, ...arguments);
    }
}
