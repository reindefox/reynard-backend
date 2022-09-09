import { AbstractEventOptions } from "@src/common/abstractions/event/interfaces/Event";
import { AbstractEvent } from "@src/common/abstractions/event/model/AbstractEvent";
import { Role } from "discord.js";

export default class RoleDeleteEvent extends AbstractEvent {
    public static readonly options: AbstractEventOptions = {
        keyName: "roleDelete",
        name: "event.roleDelete.name",
        category: "event.category.role"
    };

    constructor() {
        super(RoleDeleteEvent.options);
    }

    public async run(role: Role): Promise<void> {
        if (!role) return;
        if (!role.guild.me) return;

        await this.initialize(role.guild, ...arguments);
    }
}
