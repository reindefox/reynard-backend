import { color } from "@src/assets/json/colors";
import { AbstractEventOptions } from "@src/common/abstractions/event/interfaces/Event";
import { AbstractLoggingEvent } from "@src/common/abstractions/event/model/AbstractLoggingEvent";
import { GuildDaoManager } from "@src/database/dao/managers/GuildDaoManager";
import { icons } from "@src/modules/logging/assets/json/icons";
import { Role } from "discord.js";

export default class LogRoleCreate extends AbstractLoggingEvent {
    public static readonly options: AbstractEventOptions = {
        keyName: "roleCreate",
        name: "event.roleCreate.name",
    };

    constructor(guildDaoManager: GuildDaoManager) {
        super(LogRoleCreate.options, guildDaoManager);
    }

    protected async execute(role: Role): Promise<void> {
        const audit = await this.fetchAuditLogs(role.guild, "ROLE_CREATE");

        if (!this.canContinueExecution(null, audit?.entries.first().executor)) return;

        this.messageBuilder
            .setColor(color.green)
            .setAuthor(this.translate("eventLogger.roleCreate.name"), icons.flagCreate)
            .setDescription(this.translate("eventLogger.roleCreate.description"));

        this.messageBuilder.addField(this.translate("eventLogger.keyword.role"), this.logStringBuilder
            .addFieldLine(this.translate("eventLogger.keyword.role"), role, false)
            .addFieldLine("ID", role.id)
            .build());

        this.messageBuilder.setEventExecutor(audit);

        await this.invokeEvent();
    }
}
