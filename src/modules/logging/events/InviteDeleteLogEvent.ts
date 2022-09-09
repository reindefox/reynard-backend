import { color } from "@src/assets/json/colors";
import { AbstractEventOptions } from "@src/common/abstractions/event/interfaces/Event";
import { AbstractLoggingEvent } from "@src/common/abstractions/event/model/AbstractLoggingEvent";
import { GuildDaoManager } from "@src/database/dao/managers/GuildDaoManager";
import { icons } from "@src/modules/logging/assets/json/icons";
import { Guild, Invite } from "discord.js";

export default class LogInviteDelete extends AbstractLoggingEvent {
    public static readonly options: AbstractEventOptions = {
        keyName: "inviteDelete",
        name: "event.inviteDelete.name",
    };

    constructor(guildDaoManager: GuildDaoManager) {
        super(LogInviteDelete.options, guildDaoManager);
    }

    protected async execute(invite: Invite): Promise<void> {
        const audit = await this.fetchAuditLogs(<Guild>invite.guild, "INVITE_DELETE");

        if (!this.canContinueExecution(null, audit?.entries.first().executor)) return;

        this.messageBuilder
            .setColor(color.red)
            .setAuthor(this.translate("eventLogger.inviteDelete.name"), icons.linkDelete)
            .setDescription(this.translate("eventLogger.inviteDelete.description"));

        this.messageBuilder.addField(this.translate("eventLogger.keyword.invite"), this.logStringBuilder
            .addFieldLine(this.translate("eventLogger.keyword.link"), invite.url, false)
            .addFieldLine(this.translate("eventLogger.keyword.channel"), invite.channel, false)
            .build());

        this.messageBuilder.setEventExecutor(audit);

        await this.invokeEvent();
    }
}
