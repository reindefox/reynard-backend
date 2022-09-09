import { AbstractEventOptions } from "@src/common/abstractions/event/interfaces/Event";
import { AbstractEvent } from "@src/common/abstractions/event/model/AbstractEvent";
import { Ban, BanModel } from "@src/database/models/Ban";
import { Guild, User } from "discord.js";

export default class GuildBanRemoveEvent extends AbstractEvent {
    public static readonly options: AbstractEventOptions = {
        keyName: "guildBanRemove",
        name: "event.guildBanRemove.name",
        category: "event.category.guild"
    };

    constructor() {
        super(GuildBanRemoveEvent.options);
    }

    public async run(guild: Guild, user: User): Promise<void> {
        if (!guild || !user) return;

        await this.initialize(guild, ...arguments);

        // const ban: BanModel = await Ban.findOne({
        //     where: {
        //         guildID: guild.id,
        //         userID: user.id
        //     }
        // });
        //
        // if (ban) {
        //     await ban.destroy();
        // }
    }
}
