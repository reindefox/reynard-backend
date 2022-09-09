import { AbstractLoggingEvent } from "@src/common/abstractions/event/model/AbstractLoggingEvent";
import { TimezoneService } from "@src/services/guild/TimezoneService";
import { GuildAuditLogs, MessageEmbed } from "discord.js";
import moment from "moment-timezone";

export class LogMessageBuilder extends MessageEmbed {
    private static readonly auditMaxTimestamp: number = 5000;

    private static readonly eventTimeFormat: string = "DD-MM-YYYY kk:mm:ss dddd";

    private static readonly newFieldStart = "▫";

    private readonly timezoneService: TimezoneService;

    constructor(protected readonly event: AbstractLoggingEvent) {
        super();

        this.timezoneService = new TimezoneService(this.event.guildDaoManager.model);
    }

    public addField(name: string | string[] | any, value: string | string[] | any, inline: boolean = true): this {
        return super.addField(LogMessageBuilder.getName(name), value, inline);
    }

    private static getName(name: string | string[] | any): string {
        return `${LogMessageBuilder.newFieldStart} ${name}`;
    }

    public setEventExecutor(audit: GuildAuditLogs): this {
        if (!audit) {
            return this;
        }

        const executionTimestamp: number = new Date().getTime();
        const auditTimestamp: number = new Date(audit.entries.first().createdTimestamp).getTime();

        if (Math.abs(executionTimestamp - auditTimestamp) >= LogMessageBuilder.auditMaxTimestamp) {
            return this;
        }

        this.addField(this.event.translate("eventLogger.keyword.executor"), this.event.logStringBuilder
            .addFieldLine(this.event.translate("eventLogger.keyword.user"), audit?.entries.first().executor, false)
            .addFieldLine("ID", audit?.entries.first().executor.id)
            .addFieldLine(this.event.translate("eventLogger.keyword.tag"), audit?.entries.first().executor.tag)
            .build());

        return this;
    }

    public setFooterData(): void {
        let dateTime: string;

        if (!this.timezoneService.timezoneExists()) {
            this.timezoneService.setGuildTimezone();
        }

        dateTime = moment().tz(this.event.guildDaoManager.model.timezone).format(LogMessageBuilder.eventTimeFormat);

        this.setFooter(`${dateTime} • Unix UTC: ${moment().format("X")}`, this.event.client.user.displayAvatarURL());
    }
}
