import { color } from "@src/assets/json/colors";
import { AbstractEventOptions } from "@src/common/abstractions/event/interfaces/Event";
import { AbstractLoggingEvent } from "@src/common/abstractions/event/model/AbstractLoggingEvent";
import { GuildDaoManager } from "@src/database/dao/managers/GuildDaoManager";
import { FormatUtils } from "@src/global/utils/FormatUtils";
import { icons } from "@src/modules/logging/assets/json/icons";
import { StringUtils } from "@src/utils/StringUtils";
import { Role } from "discord.js";

export default class LogRoleDelete extends AbstractLoggingEvent {
    public static readonly options: AbstractEventOptions = {
        keyName: "roleDelete",
        name: "event.roleDelete.name",
    };

    constructor(guildDaoManager: GuildDaoManager) {
        super(LogRoleDelete.options, guildDaoManager);
    }

    protected async execute(role: Role): Promise<void> {
        const audit = await this.fetchAuditLogs(role.guild, "ROLE_DELETE");

        if (!this.canContinueExecution(null, audit?.entries.first().executor)) return;

        const permissions: string[] = FormatUtils.formatRolePermissions(role);

        this.messageBuilder
            .setColor(color.red)
            .setAuthor(this.translate("eventLogger.roleDelete.name"), icons.flagDelete)
            .setDescription(this.translate("eventLogger.roleDelete.description"));

        this.messageBuilder.addField(this.translate("eventLogger.keyword.role"), this.logStringBuilder
            .addFieldLine("ID", role.id)
            .addFieldLine(this.translate("eventLogger.keyword.name"), role.name)
            .addFieldLine(this.translate("eventLogger.keyword.color"), role.hexColor)
            .addFieldLine(this.translate("eventLogger.keyword.hoist"), this.translate("global." + role.hoist))
            .addFieldLine(this.translate("eventLogger.keyword.managed"), this.translate("global." + role.managed))
            .addFieldLine(this.translate("eventLogger.keyword.mentionable"), this.translate("global." + role.mentionable))
            .build());

        this.messageBuilder.setEventExecutor(audit);

        if (StringUtils.checkStringifiedArrayLength(permissions, 1000)) {
            this.messageBuilder.addField(this.translate("eventLogger.keyword.permissions"), permissions.length > 0 ? permissions.map(p => `\`${p}\``).join(", ") : null);
        }

        await this.invokeEvent();
    }
}
