import { color } from "@src/assets/json/colors";
import { AbstractEventOptions } from "@src/common/abstractions/event/interfaces/Event";
import { AbstractLoggingEvent } from "@src/common/abstractions/event/model/AbstractLoggingEvent";
import { GuildDaoManager } from "@src/database/dao/managers/GuildDaoManager";
import { FormatUtils } from "@src/global/utils/FormatUtils";
import { icons } from "@src/modules/logging/assets/json/icons";
import { LineType } from "@src/modules/logging/utils/LogLineStringBuilder";
import { Role } from "discord.js";
import difference from "lodash/difference";

export default class LogRoleUpdate extends AbstractLoggingEvent {
    public static readonly options: AbstractEventOptions = {
        keyName: "roleUpdate",
        name: "event.roleUpdate.name",
    };

    constructor(guildDaoManager: GuildDaoManager) {
        super(LogRoleUpdate.options, guildDaoManager);
    }

    protected async execute(oldRole: Role, newRole: Role): Promise<void> {
        const audit = await this.fetchAuditLogs(newRole.guild, "ROLE_UPDATE");

        if (!this.canContinueExecution(null, audit?.entries.first().executor)) return;

        this.messageBuilder
            .setColor(color.blue)
            .setAuthor(this.translate("eventLogger.roleUpdate.name"), icons.flagUpdate)
            .setDescription(this.translate("eventLogger.roleUpdate.description"));

        this.messageBuilder.setEventExecutor(audit);

        if (newRole.hexColor !== oldRole.hexColor) {
            this.messageBuilder.addField(this.translate("eventLogger.keyword.color"), this.logStringBuilder
                .addFieldLineProperty(LineType.NEW, newRole.hexColor)
                .addFieldLineProperty(LineType.OLD, oldRole.hexColor)
                .build());
        }
        if (newRole.hoist !== oldRole.hoist) {
            this.messageBuilder.addField(this.translate("eventLogger.keyword.hoist"), this.logStringBuilder
                .addFieldLineProperty(LineType.NEW, this.translate("global." + newRole.hoist))
                .addFieldLineProperty(LineType.OLD, this.translate("global." + oldRole.hoist))
                .build());
        }
        if (newRole.managed !== oldRole.managed) {
            this.messageBuilder.addField(this.translate("eventLogger.keyword.managed"), this.logStringBuilder
                .addFieldLineProperty(LineType.NEW, this.translate("global." + newRole.managed))
                .addFieldLineProperty(LineType.OLD, this.translate("global." + oldRole.managed))
                .build());
        }
        if (newRole.mentionable !== oldRole.mentionable) {
            this.messageBuilder.addField(this.translate("eventLogger.keyword.mentionable"), this.logStringBuilder
                .addFieldLineProperty(LineType.NEW, this.translate("global." + newRole.mentionable))
                .addFieldLineProperty(LineType.OLD, this.translate("global." + oldRole.mentionable))
                .build());
        }
        if (newRole.name !== oldRole.name) {
            this.messageBuilder.addField(this.translate("eventLogger.keyword.name"), this.logStringBuilder
                .addFieldLineProperty(LineType.NEW, newRole.name)
                .addFieldLineProperty(LineType.OLD, oldRole.name)
                .build());
        }
        if (JSON.stringify(newRole.permissions) !== JSON.stringify(oldRole.permissions)) {
            const newRolePermissions: string[] = FormatUtils.formatRolePermissions(newRole);
            const oldRolePermissions: string[] = FormatUtils.formatRolePermissions(oldRole);

            if (newRolePermissions.length > oldRolePermissions.length) {
                const diff = difference(newRolePermissions, oldRolePermissions);
                this.messageBuilder.addField(this.translate("eventLogger.keyword.permissions"), this.logStringBuilder
                    .addFieldLine(`${this.translate("eventLogger.keyword.added")} [${diff.length}]`, newRolePermissions.length > 0 ? diff.join(", ") : null)
                    .addFieldLine(`${this.translate("eventLogger.keyword.all")} [${newRolePermissions.length}]`, newRolePermissions.length > 0 ? newRolePermissions.join(", ") : null)
                    .build());
            } else {
                const diff = difference(oldRolePermissions, newRolePermissions);
                this.messageBuilder.addField(this.translate("eventLogger.keyword.permissions"), this.logStringBuilder
                    .addFieldLine(`${this.translate("eventLogger.keyword.removed")} [${diff.length}]`, newRolePermissions.length > 0 ? diff.join(", ") : null)
                    .addFieldLine(`${this.translate("eventLogger.keyword.all")} [${newRolePermissions.length}]`, newRolePermissions.length > 0 ? newRolePermissions.join(", ") : null)
                    .build());
            }
        }

        await this.invokeEvent();
    }
}
