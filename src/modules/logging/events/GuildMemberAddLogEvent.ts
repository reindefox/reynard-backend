import { color } from "@src/assets/json/colors";
import { AbstractEventOptions } from "@src/common/abstractions/event/interfaces/Event";
import { AbstractLoggingEvent } from "@src/common/abstractions/event/model/AbstractLoggingEvent";
import { GuildDaoManager } from "@src/database/dao/managers/GuildDaoManager";
import { FormatUtils } from "@src/global/utils/FormatUtils";
import { icons } from "@src/modules/logging/assets/json/icons";
import { GuildMember, User } from "discord.js";

export default class LogGuildMemberAdd extends AbstractLoggingEvent {
    public static readonly options: AbstractEventOptions = {
        keyName: "guildMemberAdd",
        name: "event.guildMemberAdd.name",
    };

    constructor(guildDaoManager: GuildDaoManager) {
        super(LogGuildMemberAdd.options, guildDaoManager);
    }

    protected async execute(member: GuildMember): Promise<void> {
        this.messageBuilder.setColor(color.green);

        if (!member.user.bot) {
            this.messageBuilder
                .setAuthor(this.translate("eventLogger.guildMemberAdd.memberJoinName"), icons.memberJoin)
                .setDescription(this.translate("eventLogger.guildMemberAdd.memberJoinDescription"));
        } else {
            const audit = await this.fetchAuditLogs(member.guild, "BOT_ADD");

            if (audit && (<User>audit.entries.first().target).bot) {
                this.messageBuilder.setEventExecutor(audit);
            }

            this.messageBuilder
                .setAuthor(this.translate("eventLogger.guildMemberAdd.botAddName"), icons.botJoin)
                .setDescription(this.translate("eventLogger.guildMemberAdd.botAddDescription"));
        }

        this.messageBuilder.addField(this.translate("eventLogger.keyword.member"), this.logStringBuilder
            .addFieldLine(this.translate("eventLogger.keyword.user"), member, false)
            .addFieldLine("ID", member.id)
            .addFieldLine(this.translate("eventLogger.keyword.tag"), member.user.tag)
            .addFieldLine(this.translate("eventLogger.keyword.registered"), FormatUtils.getUTCTime(Number(member.user.createdAt)))
            .addFieldLine(this.translate("eventLogger.keyword.accountAge"), Math.floor((Number(new Date()) - Number(member.user.createdAt)) / 86400000))
            .build());

        await this.invokeEvent();
    }
}
