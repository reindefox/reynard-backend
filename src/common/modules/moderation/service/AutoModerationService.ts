import { GuildDaoManager } from "@src/database/dao/managers/GuildDaoManager";
import { BaseAutoModerationFilterConstructor } from "@src/common/modules/moderation/interfaces/BaseAutoModerationFilterConstructor";
import { AutoModerationMentionsFilter } from "@src/common/modules/moderation/service/automoderation/filters/AutoModerationMentionsFilter";
import { Message } from "discord.js";

export class AutoModerationService {
    constructor(private readonly message: Message, private readonly guildDaoManager: GuildDaoManager) {
    }

    public async register(): Promise<void> {
        if (!new AutoModerationMentionsFilter(this.createFilterStructureByProperty(null)).apply(1)) {
            return;
        }
    }

    private createFilterStructureByProperty(property: string): BaseAutoModerationFilterConstructor {
        return {
            allowedChannels: [],
            allowedMembers: [],
            allowedRoles: [],
            deleteSourceMessage: false,
            ignoreRoot: false,
            ignoredChannels: [],
            ignoredMembers: [],
            ignoredRoles: [],
            punishmentType: undefined
        };
    }
}
