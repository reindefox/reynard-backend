import { color } from "@src/assets/json/colors";
import { AbstractEventOptions } from "@src/common/abstractions/event/interfaces/Event";
import { AbstractLoggingEvent } from "@src/common/abstractions/event/model/AbstractLoggingEvent";
import { GuildDaoManager } from "@src/database/dao/managers/GuildDaoManager";
import { FormatUtils } from "@src/global/utils/FormatUtils";
import { icons } from "@src/modules/logging/assets/json/icons";
import { Guild, Invite } from "discord.js";

export default class LogInviteCreate extends AbstractLoggingEvent {
    public static readonly options: AbstractEventOptions = {
        keyName: "inviteCreate",
        name: "event.inviteCreate.name",
    };

    constructor(guildDaoManager: GuildDaoManager) {
        super(LogInviteCreate.options, guildDaoManager);
    }

    protected async execute(invite: Invite): Promise<void> {
        const audit = await this.fetchAuditLogs(<Guild>invite.guild, "INVITE_CREATE");

        if (!this.canContinueExecution(null, audit?.entries.first().executor)) return;

        this.messageBuilder
            .setColor(color.green)
            .setAuthor(this.translate("eventLogger.inviteCreate.name"), icons.linkCreate)
            .setDescription(this.translate("eventLogger.inviteCreate.description"));

        this.messageBuilder.addField(this.translate("eventLogger.keyword.invite"), this.logStringBuilder
            .addFieldLine(this.translate("eventLogger.keyword.link"), invite.url, false)
            .addFieldLine(this.translate("eventLogger.keyword.channel"), invite.channel, false)
            .append(" " + `(${this.translate("eventLogger.keyword.name")}: \`${invite.channel.name}\`, ID: \`${invite.channel.id}\`, ${this.translate("eventLogger.keyword.type")}: \`${invite.channel.type}\`)` + "\n")
            .addFieldLine(this.translate("eventLogger.inviteCreate.expiresAt"), invite.expiresAt ? FormatUtils.getUTCTime(Number(invite.expiresAt)) : this.translate("eventLogger.keyword.never"))
            .addFieldLine(this.translate("eventLogger.inviteCreate.maxAge"), invite.maxAge !== 0 ? invite.maxAge / 3600 + " h" : "∞")
            .addFieldLine(this.translate("eventLogger.inviteCreate.maxUses"), invite.maxUses !== 0 ? invite.maxUses : "∞")
            .addFieldLine(this.translate("eventLogger.inviteCreate.temporary"), invite.temporary)
            .build());

        this.messageBuilder.setEventExecutor(audit);

        await this.invokeEvent();
    }
}
