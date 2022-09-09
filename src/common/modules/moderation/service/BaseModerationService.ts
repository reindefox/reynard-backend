import { GuildDaoManager } from "@src/database/dao/managers/GuildDaoManager";
import { Guild } from "discord.js";

export class BaseModerationService {
    constructor(public readonly guild: Guild, public readonly guildDaoManager: GuildDaoManager) {
    }
}
