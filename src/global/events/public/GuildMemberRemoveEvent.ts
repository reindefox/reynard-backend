import { AbstractEventOptions } from "@src/common/abstractions/event/interfaces/Event";
import { AbstractEvent } from "@src/common/abstractions/event/model/AbstractEvent";
import { GuildMember } from "discord.js";

export default class GuildMemberRemoveEvent extends AbstractEvent {
    public static readonly options: AbstractEventOptions = {
        keyName: "guildMemberRemove",
        name: "event.guildMemberRemove.name",
        category: "event.category.guild"
    };

    constructor() {
        super(GuildMemberRemoveEvent.options);
    }

    public async run(member: GuildMember): Promise<void> {
        if (!member) return;
        if (!member.guild) return;
        if (!member.guild.me) return;
        if (member.id === this.client.user.id) return;

        await this.initialize(member.guild, ...arguments);
    }
}
