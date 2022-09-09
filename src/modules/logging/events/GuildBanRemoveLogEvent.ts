import { color } from "@src/assets/json/colors";
import { AbstractEventOptions } from "@src/common/abstractions/event/interfaces/Event";
import { AbstractLoggingEvent } from "@src/common/abstractions/event/model/AbstractLoggingEvent";
import { GuildDaoManager } from "@src/database/dao/managers/GuildDaoManager";
import { icons } from "@src/modules/logging/assets/json/icons";
import { Guild, GuildAuditLogs, User } from "discord.js";

export default class LogGuildBanRemove extends AbstractLoggingEvent {
    public static readonly options: AbstractEventOptions = {
        keyName: "guildBanRemove",
        name: "event.guildBanRemove.name",
    };

    constructor(guildDaoManager: GuildDaoManager) {
        super(LogGuildBanRemove.options, guildDaoManager);
    }

    protected async execute(guild: Guild, user: User): Promise<void> {
        const audit: GuildAuditLogs = await this.fetchAuditLogs(guild, "MEMBER_BAN_REMOVE");

        if (!this.canContinueExecution(null, audit?.entries.first().executor)) return;

        this.messageBuilder
            .setColor(color.green)
            .setAuthor(this.translate("eventLogger.guildBanRemove.name"), icons.memberJoin)
            .setDescription(this.translate("eventLogger.guildBanRemove.description"));

        this.messageBuilder.addField(this.translate("eventLogger.guildBanRemove.unbannedUser"), this.logStringBuilder
            .addFieldLine(this.translate("eventLogger.keyword.user"), user, false)
            .addFieldLine("ID", user)
            .addFieldLine(this.translate("eventLogger.keyword.tag"), user.tag)
            .build());

        this.messageBuilder.setEventExecutor(audit);

        await this.invokeEvent();
    }
}
