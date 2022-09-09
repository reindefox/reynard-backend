import { AbstractEventOptions } from "@src/common/abstractions/event/interfaces/Event";
import { AbstractEvent } from "@src/common/abstractions/event/model/AbstractEvent";
import { GuildMember } from "discord.js";

export default class GuildMemberUpdateEvent extends AbstractEvent {
    public static readonly options: AbstractEventOptions = {
        keyName: "guildMemberUpdate",
        name: "event.guildMemberRemove.name",
        category: "event.category.guild"
    };

    constructor() {
        super(GuildMemberUpdateEvent.options);
    }

    public async run(oldMember: GuildMember, newMember: GuildMember): Promise<void> {
        if (!oldMember || !newMember) return;
        if (!oldMember.guild || !newMember.guild) return;
        if (oldMember.id === this.client.user.id
            || newMember.id === this.client.user.id) return;
        if (!newMember.guild.me) return;

        await this.initialize(newMember.guild, ...arguments);
    }
}
