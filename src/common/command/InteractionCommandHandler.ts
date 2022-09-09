import { Base } from "@src/common/abstractions/Base";
import { GuildDaoManager } from "@src/database/dao/managers/GuildDaoManager";
import { CommandHandlerConstructor } from "@src/common/command/CommandHandlerConstructor";
import { Interaction } from "discord.js";

export class InteractionCommandHandler extends Base implements CommandHandlerConstructor {
    constructor(private readonly interaction: Interaction, private readonly guildDaoManager: GuildDaoManager) {
        super();
    }

    public async register(): Promise<void> {

    }
}
