import { AbstractEventOptions } from "@src/common/abstractions/event/interfaces/Event";
import { AbstractEvent } from "@src/common/abstractions/event/model/AbstractEvent";
import { Role } from "discord.js";

export default class RoleCreateEvent extends AbstractEvent {
    public static readonly options: AbstractEventOptions = {
        keyName: "roleCreate",
        name: "event.roleCreate.name",
        category: "event.category.role"
    };

    constructor() {
        super(RoleCreateEvent.options);
    }

    public async run(role: Role): Promise<void> {
        if (!role) return;

        await this.initialize(role.guild, ...arguments);
    }
}
