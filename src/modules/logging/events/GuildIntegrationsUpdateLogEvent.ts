import { color } from "@src/assets/json/colors";
import { AbstractEventOptions } from "@src/common/abstractions/event/interfaces/Event";
import { AbstractLoggingEvent } from "@src/common/abstractions/event/model/AbstractLoggingEvent";
import { GuildDaoManager } from "@src/database/dao/managers/GuildDaoManager";
import { icons } from "@src/modules/logging/assets/json/icons";
import { createErrorLog } from "@src/scripts/Logger";
import { Guild, GuildAuditLogs, Permissions } from "discord.js";

export default class LogGuildIntegrationsUpdate extends AbstractLoggingEvent {
    public static readonly options: AbstractEventOptions = {
        keyName: "guildIntegrationsUpdate",
        name: "event.guildIntegrationsUpdate.name",
    };

    constructor(guildDaoManager: GuildDaoManager) {
        super(LogGuildIntegrationsUpdate.options, guildDaoManager);
    }

    protected async execute(guild: Guild): Promise<void> {
        const audit: GuildAuditLogs = await this.fetchAuditLogs(guild);

        if (!this.canContinueExecution(null, audit?.entries.first().executor)) return;

        if (!audit) {
            this.messageBuilder
                .setColor(color.green)
                .setDescription(this.translate("eventLogger.guildIntegrationsUpdate.updateDescription"))
                .setAuthor(this.translate("eventLogger.guildIntegrationsUpdate.updateName"), icons.linkUpdate);
        }

        this.messageBuilder.setEventExecutor(audit);

        await this.invokeEvent();
    }

    protected async fetchAuditLogs(guild: Guild): Promise<GuildAuditLogs> {
        if (this.guildDaoManager.data.me.permissions.has(Permissions.FLAGS.VIEW_AUDIT_LOG) && this.guildDaoManager.model.showLogExecutor) {
            let audit: GuildAuditLogs = null;

            await guild.fetchAuditLogs({
                limit: 1
            })
                .then((logs: GuildAuditLogs) => {
                    switch (logs.entries.first().action) {
                        case "INTEGRATION_CREATE": {
                            this.messageBuilder
                                .setColor(color.green)
                                .setDescription(this.translate("eventLogger.guildIntegrationsUpdate.createDescription"))
                                .setAuthor(this.translate("eventLogger.guildIntegrationsUpdate.createName"), icons.linkCreate);
                            audit = logs;
                            break;
                        }
                        case "INTEGRATION_DELETE": {
                            this.messageBuilder
                                .setColor(color.green)
                                .setDescription(this.translate("eventLogger.guildIntegrationsUpdate.updateDescription"))
                                .setAuthor(this.translate("eventLogger.guildIntegrationsUpdate.deleteName"), icons.linkDelete);
                            audit = logs;
                            break;
                        }
                        case "INTEGRATION_UPDATE": {
                            this.messageBuilder
                                .setColor(color.green)
                                .setDescription(this.translate("eventLogger.guildIntegrationsUpdate.updateDescription"))
                                .setAuthor(this.translate("eventLogger.guildIntegrationsUpdate.updateName"), icons.linkUpdate);
                            audit = logs;
                            break;
                        }
                        default: {
                            break;
                        }
                    }
                })
                .catch(e => createErrorLog(e, __filename));

            return audit;
        }

        return null;
    }
}
