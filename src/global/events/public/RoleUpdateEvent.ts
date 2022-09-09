import { AbstractEventOptions } from "@src/common/abstractions/event/interfaces/Event";
import { AbstractEvent } from "@src/common/abstractions/event/model/AbstractEvent";
import { Role } from "discord.js";

export default class RoleUpdateEvent extends AbstractEvent {
    public static readonly options: AbstractEventOptions = {
        keyName: "roleUpdate",
        name: "event.roleUpdate.name",
        category: "event.category.role"
    };

    constructor() {
        super(RoleUpdateEvent.options);
    }

    public async run(oldRole: Role, newRole: Role): Promise<void> {
        if (!oldRole || !newRole) return;

        if (newRole.hexColor !== oldRole.hexColor
            || newRole.hoist !== oldRole.hoist
            || newRole.managed !== oldRole.managed
            || newRole.mentionable !== oldRole.mentionable
            || newRole.name !== oldRole.name
            || JSON.stringify(newRole.permissions) !== JSON.stringify(oldRole.permissions)) {
            await this.initialize(newRole.guild, ...arguments);
        }
    }
}
