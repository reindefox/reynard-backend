import { color } from "@src/assets/json/colors";
import { AbstractEventOptions } from "@src/common/abstractions/event/interfaces/Event";
import { AbstractLoggingEvent } from "@src/common/abstractions/event/model/AbstractLoggingEvent";
import { GuildDaoManager } from "@src/database/dao/managers/GuildDaoManager";
import { FormatUtils } from "@src/global/utils/FormatUtils";
import { icons } from "@src/modules/logging/assets/json/icons";
import { LineType } from "@src/modules/logging/utils/LogLineStringBuilder";
import { createErrorLog } from "@src/scripts/Logger";
import { AuditLogChange, Guild, GuildAuditLogs, Permissions, TextChannel, Webhook } from "discord.js";

export default class WebHookUpdate extends AbstractLoggingEvent {
    public static readonly options: AbstractEventOptions = {
        keyName: "webhookUpdate",
        name: "event.webhookUpdate.name",
    };

    constructor(guildDaoManager: GuildDaoManager) {
        super(WebHookUpdate.options, guildDaoManager);
    }

    protected async execute(channel: TextChannel): Promise<void> {
        const audit: GuildAuditLogs = await this.fetchAuditLogs(channel.guild);

        if (!audit) {
            return;
        }

        if (!this.canContinueExecution(channel, audit?.entries.first().executor)) return;

        const webHook: Webhook = <Webhook>audit?.entries.first().target;

        this.messageBuilder.addField(this.translate("eventLogger.keyword.webhook"), this.logStringBuilder
            .addFieldLine(this.translate("eventLogger.keyword.name"), webHook?.name)
            .addFieldLine("ID", webHook?.id)
            .addFieldLine(this.translate("eventLogger.keyword.type"), webHook?.type)
            .addFieldLine("URL", webHook?.url)
            .addFieldLine(this.translate("eventLogger.webhookUpdate.token"), webHook?.token ? `||${webHook?.token}||` : null)
            .addFieldLine(this.translate("eventLogger.webhookUpdate.owner"), webHook?.owner, false)
            .addFieldLine(this.translate("eventLogger.keyword.createdAt"), FormatUtils.getUTCTime(Number(webHook?.createdAt)))
            .build());

        this.messageBuilder.addField(this.translate("eventLogger.keyword.channel"), this.logStringBuilder
            .addFieldLine(this.translate("eventLogger.keyword.channel"), channel, false)
            .addFieldLine("ID", channel.id)
            .addFieldLine(this.translate("eventLogger.keyword.name"), channel.name)
            .build());

        switch (audit?.entries.first().action) {
            case "WEBHOOK_CREATE": {
                this.messageBuilder
                    .setColor(color.green)
                    .setAuthor(this.translate("eventLogger.webhookUpdate.webhookCreateName"), icons.connectCreate)
                    .setDescription(this.translate("eventLogger.webhookUpdate.webhookCreateDescription"));
                break;
            }
            case "WEBHOOK_DELETE": {
                this.messageBuilder
                    .setColor(color.red)
                    .setAuthor(this.translate("eventLogger.webhookUpdate.webhookDeleteName"), icons.channelDelete)
                    .setDescription(this.translate("eventLogger.webhookUpdate.webhookDeleteDescription"));
                break;
            }
            case "WEBHOOK_UPDATE": {
                this.messageBuilder
                    .setColor(color.blue)
                    .setAuthor(this.translate("eventLogger.webhookUpdate.webhookUpdateName"), icons.connectUpdate)
                    .setDescription(this.translate("eventLogger.webhookUpdate.webhookUpdateDescription"));

                for (const change of audit.entries.first().changes) {
                    const changes: AuditLogChange = change;

                    if (changes.new !== changes.old) {
                        if (changes.key === "name") {
                            this.messageBuilder.addField(this.translate("eventLogger.webhookUpdate.nameUpdate"), this.logStringBuilder
                                .addFieldLineProperty(LineType.NEW, changes.new)
                                .addFieldLineProperty(LineType.OLD, changes.old)
                                .build());
                        }
                        if (changes.key === "avatar_hash") {
                            const logStringBuilder = this.logStringBuilder;

                            if (changes.new) {
                                logStringBuilder.addFieldLineProperty(LineType.NEW, `https://cdn.discordapp.com/avatars/${webHook.id}/${changes.new}`, false);
                            }

                            if (changes.old) {
                                logStringBuilder.addFieldLineProperty(LineType.OLD, `https://cdn.discordapp.com/avatars/${webHook.id}/${changes.old}`, false);
                            }

                            this.messageBuilder.addField(this.translate("eventLogger.webhookUpdate.avatarUpdate"), logStringBuilder
                                .build());
                        }
                        if (changes.key === "channel_id") {
                            const newChannel = this.client.guilds.cache.get(webHook.guildId).channels.cache.get(changes.new.toString());
                            if (!newChannel) return;
                            const oldChannel = this.client.guilds.cache.get(webHook.guildId).channels.cache.get(changes.old.toString());
                            if (!oldChannel) return;

                            this.messageBuilder.addField(this.translate("eventLogger.webhookUpdate.channelUpdate"), this.logStringBuilder
                                .addNewDataLine()
                                .addFieldLine(this.translate("eventLogger.keyword.channel"), newChannel, false)
                                .addFieldLine("ID", newChannel.id)
                                .addFieldLine(this.translate("eventLogger.keyword.name"), newChannel.name)
                                .addOldDataLine()
                                .addFieldLine(this.translate("eventLogger.keyword.channel"), oldChannel, false)
                                .addFieldLine("ID", oldChannel.id)
                                .addFieldLine(this.translate("eventLogger.keyword.name"), oldChannel.name)
                                .build());
                        }
                    }
                }
                break;
            }
            default: {
                break;
            }
        }

        await this.invokeEvent();
    }

    protected async fetchAuditLogs(guild: Guild): Promise<GuildAuditLogs> {
        if (this.guildDaoManager.data.me.permissions.has(Permissions.FLAGS.VIEW_AUDIT_LOG) && this.guildDaoManager.model.showLogExecutor) {
            let audit: GuildAuditLogs = null;

            await guild.fetchAuditLogs({
                limit: 1
            })
                .then((logs: GuildAuditLogs) => {
                    switch (logs?.entries.first().action) {
                        case "WEBHOOK_CREATE":
                        case "WEBHOOK_UPDATE":
                        case "WEBHOOK_DELETE": {
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
