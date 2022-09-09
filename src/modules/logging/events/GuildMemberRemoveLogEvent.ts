import { color } from "@src/assets/json/colors";
import { AbstractEventOptions } from "@src/common/abstractions/event/interfaces/Event";
import { AbstractLoggingEvent } from "@src/common/abstractions/event/model/AbstractLoggingEvent";
import { GuildDaoManager } from "@src/database/dao/managers/GuildDaoManager";
import { Constants } from "@src/global/constants/Constants";
import { icons } from "@src/modules/logging/assets/json/icons";
import { StringUtils } from "@src/utils/StringUtils";
import { GuildMember, Role, User } from "discord.js";

export default class LogGuildMemberRemove extends AbstractLoggingEvent {
    public static readonly options: AbstractEventOptions = {
        keyName: "guildMemberRemove",
        name: "event.guildMemberRemove.name",
    };

    constructor(guildDaoManager: GuildDaoManager) {
        super(LogGuildMemberRemove.options, guildDaoManager);
    }

    protected async execute(member: GuildMember): Promise<void> {
        const audit = await this.fetchAuditLogs(member.guild, "MEMBER_KICK");

        if (!this.canContinueExecution(null, audit?.entries.first().executor)) return;

        this.messageBuilder.setColor(color.red);

        if (!member.user.bot) {
            if (audit && (<User>audit?.entries.first().target).id === member.id
                && audit?.entries.first().executor.id !== member.id) {
                this.messageBuilder
                    .setEventExecutor(audit)
                    .setAuthor(this.translate("eventLogger.guildMemberRemove.memberKickName"), icons.memberRemove)
                    .setDescription(this.translate("eventLogger.guildMemberRemove.memberKickDescription"));
            } else {
                this.messageBuilder
                    .setAuthor(this.translate("eventLogger.guildMemberRemove.memberLeaveName"), icons.memberRemove)
                    .setDescription(this.translate("eventLogger.guildMemberRemove.memberLeaveDescription"));
            }
        } else {
            this.messageBuilder
                .setAuthor(this.translate("eventLogger.guildMemberRemove.botKickName"), icons.botRemove)
                .setDescription(this.translate("eventLogger.guildMemberRemove.botKickDescription"));
        }

        if (audit?.entries.first().reason !== null) {
            this.messageBuilder.addField(this.translate("eventLogger.keyword.reason"),
                `\`${audit.entries.first().reason}\``, true);
        }

        this.messageBuilder.addField(this.translate("eventLogger.keyword.member"), this.logStringBuilder
            .addFieldLine(this.translate("eventLogger.keyword.member"), member, false)
            .addFieldLine("ID", member.id)
            .addFieldLine(this.translate("eventLogger.keyword.nickname"), member.nickname)
            .addFieldLine(this.translate("eventLogger.keyword.tag"), member.user.tag)
            .build());

        const roles: Role[] = member.roles.cache.filter(r => r.name !== Constants.everyoneRoleName).map(r => r);

        if (roles?.length > 0 && StringUtils.checkStringifiedArrayLength(roles, 1000)) {
            this.messageBuilder.addField(this.translate("eventLogger.keyword.roles"),
                roles.join(" "), true);
        }

        await this.invokeEvent();
    }
}
