import { AbstractEventOptions } from "@src/common/abstractions/event/interfaces/Event";
import { AbstractEvent } from "@src/common/abstractions/event/model/AbstractEvent";
import { Guild, Invite } from "discord.js";

export default class InviteCreateEvent extends AbstractEvent {
    public static readonly options: AbstractEventOptions = {
        keyName: "inviteCreate",
        name: "event.inviteCreate.name",
        category: "event.category.invite"
    };

    constructor() {
        super(InviteCreateEvent.options);
    }

    public async run(invite: Invite): Promise<void> {
        if (!invite) return;

        await this.initialize(<Guild>invite.guild, ...arguments);
    }
}
