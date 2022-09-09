import { EventList, EventListOptions, eventsList } from "@src/assets/json/eventsList";
import { AbstractEventConstructor, AbstractEventOptions } from "@src/common/abstractions/event/interfaces/Event";
import { AbstractEvent } from "@src/common/abstractions/event/model/AbstractEvent";
import { GuildDaoManager } from "@src/database/dao/managers/GuildDaoManager";
import { LogLineStringBuilder } from "@src/modules/logging/utils/LogLineStringBuilder";
import { LogMessageBuilder } from "@src/modules/logging/utils/LogMessageBuilder";
import { createErrorLog } from "@src/scripts/Logger";
import { BaseMessageUtils } from "@src/common/command/service/BaseMessageUtils";
import { Guild, GuildAuditLogs, GuildAuditLogsAction, GuildChannel, Permissions, User, Webhook } from "discord.js";

export abstract class AbstractLoggingEvent extends AbstractEvent implements AbstractEventConstructor {
    protected readonly messageBuilder: LogMessageBuilder;

    private static readonly eventKeys: string[] = Object.keys(eventsList);

    protected constructor(public readonly eventOptions: AbstractEventOptions, public readonly guildDaoManager: GuildDaoManager) {
        super(eventOptions);

        this.messageBuilder = new LogMessageBuilder(this);
    }

    public async run(...args: unknown[]): Promise<void> {
        if (this.canExecute()) {
            await this.execute(...args);
        }
    }

    private canExecute(): boolean {
        if (!this.guildDaoManager.model.logModuleToggle) {
            return false;
        }

        let parseLogs: EventList = this.guildDaoManager.model.logs;

        if (!parseLogs) {
            return false;
        }

        for (let i in AbstractLoggingEvent.eventKeys) {
            if (AbstractLoggingEvent.eventKeys.hasOwnProperty(i)) {
                if (!parseLogs.hasOwnProperty(AbstractLoggingEvent.eventKeys[i])) {
                    parseLogs[AbstractLoggingEvent.eventKeys[i]] = eventsList[AbstractLoggingEvent.eventKeys[i]];
                }
            }
        }

        if (!parseLogs[this.eventOptions.keyName]?.toggle || !parseLogs[this.eventOptions.keyName]?.id?.length) {
            return false;
        }

        return true;
    }

    protected canContinueExecution(channel?: GuildChannel, executor?: User): boolean {
        if (channel) {
            if (this.channelIgnored(channel)) return false;
        }

        if (executor) {
            if (this.executorIgnored(executor)) {
                return false;
            }

            if (executor.bot) {
                return this.botsIgnored();
            }
        }

        return true;
    }

    private botsIgnored(): boolean {
        return this.guildDaoManager.model.listenBots;
    }

    private executorIgnored(executor: User): boolean {
        return this.guildDaoManager.model.logIgnoredMembers.includes(executor.id);
    }

    private channelIgnored(channel: GuildChannel): boolean {
        return this.guildDaoManager.model.logIgnoredChannels.includes(channel.id);
    }

    protected async invokeEvent(): Promise<void> {
        if (this.messageBuilder.fields?.length === 0) return;

        const parseLogs: EventList = this.guildDaoManager.model.logs;

        if (!parseLogs) {
            return;
        }

        const webhookData: EventListOptions = parseLogs[this.eventOptions.keyName];

        if (!webhookData) {
            return;
        }

        const webHook: Webhook = await this.client.fetchWebhook(webhookData.id)
            .catch((e) => createErrorLog(e, __filename, false));

        if (!webHook) {
            return;
        }

        BaseMessageUtils.formatEmbedStructure(this.messageBuilder);

        this.messageBuilder.setTimestamp();
        this.messageBuilder.setFooterData();

        await webHook.send({
            embeds: [
                this.messageBuilder
            ]
        })
            .catch(e => createErrorLog(e, __filename));
    }

    public translate(properties: string, args?: unknown[]): string {
        return this.guildDaoManager.localeService.translate(properties, args);
    }

    public get languageRecord(): Record<any, any> {
        return this.guildDaoManager.localeService.languageRecord;
    }

    public get logStringBuilder(): LogLineStringBuilder {
        return new LogLineStringBuilder(this.guildDaoManager);
    }

    protected async fetchAuditLogs(guild: Guild, logType: GuildAuditLogsAction): Promise<GuildAuditLogs> {
        if (this.guildDaoManager.data.me.permissions.has(Permissions.FLAGS.VIEW_AUDIT_LOG) && this.guildDaoManager.model.showLogExecutor) {
            return guild.fetchAuditLogs({
                limit: 1,
                type: logType
            })
                .catch(e => createErrorLog(e, __filename));
        }

        return null;
    }

    protected abstract execute(...args: unknown[]): void | Promise<void>;
}
