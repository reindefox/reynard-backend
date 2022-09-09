import { color } from "@src/assets/json/colors";
import { AbstractEventOptions } from "@src/common/abstractions/event/interfaces/Event";
import { AbstractLoggingEvent } from "@src/common/abstractions/event/model/AbstractLoggingEvent";
import { GuildDaoManager } from "@src/database/dao/managers/GuildDaoManager";
import { icons } from "@src/modules/logging/assets/json/icons";
import { Guild, GuildAuditLogs, User } from "discord.js";

export default class LogGuildBanAdd extends AbstractLoggingEvent {
    public static readonly options: AbstractEventOptions = {
        keyName: "guildBanAdd",
        name: "event.guildBanAdd.name",
    };

    constructor(guildDaoManager: GuildDaoManager) {
        super(LogGuildBanAdd.options, guildDaoManager);
    }

    protected async execute(guild: Guild, user: User): Promise<void> {
        const audit: GuildAuditLogs = await this.fetchAuditLogs(guild, "MEMBER_BAN_ADD");

        if (!this.canContinueExecution(null, audit?.entries.first().executor)) return;

        this.messageBuilder
            .setColor(color.green)
            .setAuthor(this.translate("eventLogger.guildBanAdd.name"), icons.memberRemove)
            .setDescription(this.translate("eventLogger.guildBanAdd.description"));

        this.messageBuilder.addField(this.translate("eventLogger.guildBanAdd.bannedUser"), this.logStringBuilder
            .addFieldLine(this.translate("eventLogger.keyword.user"), user, false)
            .addFieldLine("ID", user)
            .addFieldLine(this.translate("eventLogger.keyword.tag"), user.tag)
            .build());

        if (audit?.entries.first().reason !== null) {
            this.messageBuilder.addField(this.translate("eventLogger.keyword.reason"),
                `\`${audit.entries.first().reason}\``, true);
        }

        this.messageBuilder.setEventExecutor(audit);

        await this.invokeEvent();
    }
}
