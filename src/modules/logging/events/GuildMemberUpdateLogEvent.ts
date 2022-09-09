import { color } from "@src/assets/json/colors";
import { AbstractEventOptions } from "@src/common/abstractions/event/interfaces/Event";
import { AbstractLoggingEvent } from "@src/common/abstractions/event/model/AbstractLoggingEvent";
import { GuildDaoManager } from "@src/database/dao/managers/GuildDaoManager";
import { Constants } from "@src/global/constants/Constants";
import { icons } from "@src/modules/logging/assets/json/icons";
import { LineType } from "@src/modules/logging/utils/LogLineStringBuilder";
import { GuildMember, Role } from "discord.js";
import difference from "lodash/difference";

export default class LogGuildMemberUpdate extends AbstractLoggingEvent {
    public static readonly options: AbstractEventOptions = {
        keyName: "guildMemberUpdate",
        name: "event.guildMemberUpdate.name",
    };

    constructor(guildDaoManager: GuildDaoManager) {
        super(LogGuildMemberUpdate.options, guildDaoManager);
    }

    protected async execute(oldMember: GuildMember, newMember: GuildMember): Promise<void> {
        if (!this.canContinueExecution(null, newMember.user)) return;

        if (newMember.nickname !== oldMember.nickname ||
            newMember.roles.cache.size !== oldMember.roles.cache.size) {
            this.messageBuilder
                .setColor(color.blue)
                .setAuthor(this.translate("eventLogger.guildMemberUpdate.name"), icons.memberUpdate)
                .setDescription(this.translate("eventLogger.guildMemberUpdate.description"));

            this.messageBuilder.addField(this.translate("eventLogger.keyword.member"), this.logStringBuilder
                .addFieldLine(this.translate("eventLogger.keyword.user"), newMember, false)
                .addFieldLine("ID", newMember.id)
                .addFieldLine(this.translate("eventLogger.keyword.tag"), newMember.user.tag)
                .build());

            if (newMember.nickname !== oldMember.nickname) {
                this.messageBuilder.addField(this.translate("eventLogger.keyword.nickname"), this.logStringBuilder
                    .addFieldLineProperty(LineType.NEW, newMember.nickname, null, true)
                    .addFieldLineProperty(LineType.OLD, oldMember.nickname, null, true)
                    .build());
            }
            if (newMember.roles.cache.size !== oldMember.roles.cache.size) {
                const newMemberRoles: Role[] = newMember.roles.cache
                    .filter(r => r.name !== Constants.everyoneRoleName)
                    .map(r => r);
                const oldMemberRoles: Role[] = oldMember.roles.cache
                    .filter(r => r.name !== Constants.everyoneRoleName)
                    .map(r => r);

                if (newMemberRoles.length > oldMemberRoles.length) {
                    const diff = difference(newMemberRoles, oldMemberRoles);
                    this.messageBuilder.addField(this.translate("eventLogger.keyword.roles"),
                        `**${this.translate("eventLogger.keyword.added")} [${diff.length}]:** ${diff.join(" ")}`)
                } else {
                    const diff = difference(oldMemberRoles, newMemberRoles);
                    this.messageBuilder.addField(this.translate("eventLogger.keyword.roles"),
                        `**${this.translate("eventLogger.keyword.removed")} [${diff.length}]:** ${diff.join(" ")}`);
                }
                if (newMemberRoles.toString().length <= 1000) {
                    const index: number = this.messageBuilder.fields
                        .map(f => f)
                        .findIndex(f => f.name === `▫ ${this.translate("eventLogger.keyword.roles")}`);
                    if (newMemberRoles.length > 0) {
                        this.messageBuilder.fields[index].value += `\n**${this.translate("eventLogger.keyword.all")} [${newMemberRoles.length}]:** ${newMemberRoles.join(" ")}`;
                    } else {
                        this.messageBuilder.fields[index].value += `\n**${this.translate("eventLogger.keyword.all")}:** \`${this.translate("eventLogger.keyword.none")}\``;
                    }
                }
            }
        }

        await this.invokeEvent();
    }
}
