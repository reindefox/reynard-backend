import { AbstractEventOptions } from "@src/common/abstractions/event/interfaces/Event";
import { AbstractEvent } from "@src/common/abstractions/event/model/AbstractEvent";
import { Guild, Invite } from "discord.js";

export default class InviteDeleteEvent extends AbstractEvent {
    public static readonly options: AbstractEventOptions = {
        keyName: "inviteDelete",
        name: "event.inviteDelete.name",
        category: "event.category.invite"
    };

    constructor() {
        super(InviteDeleteEvent.options);
    }

    public async run(invite: Invite): Promise<void> {
        if (!invite) return;

        await this.initialize(<Guild>invite.guild, ...arguments);
    }
}
