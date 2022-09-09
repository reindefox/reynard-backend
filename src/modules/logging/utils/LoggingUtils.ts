import { GuildDaoManager } from "@src/database/dao/managers/GuildDaoManager";
import { Constants } from "@src/global/constants/Constants";
import { LogMessageBuilder } from "@src/modules/logging/utils/LogMessageBuilder";
import { StringUtils } from "@src/utils/StringUtils";
import { GuildChannel, PermissionOverwrites, Role } from "discord.js";

export class LoggingUtils {
    public static getChannelPermissions(channel: GuildChannel, messageEmbed: LogMessageBuilder, guildDaoManager: GuildDaoManager): void {
        const permissions: PermissionOverwrites[] = channel.permissionOverwrites.cache.map(p => p).filter(r => !channel.guild.roles.cache.get(r.id).name.includes(Constants.everyoneRoleName));
        let permission: string = "";
        const roles: any[] = [];

        for (let i in permissions) {
            const role: Role = channel.guild.roles.cache.get(permissions[i].id);
            if (role) {
                if (channel.type === "GUILD_VOICE") {
                    permission = guildDaoManager.localeService.languageRecord.eventLogger.keyword.viewConnect;
                    roles.push(role);
                } else {
                    permission = guildDaoManager.localeService.languageRecord.eventLogger.keyword.viewRead;
                    roles.push(role);
                }
            }
        }

        if (StringUtils.checkStringifiedArrayLength(roles.concat(permissions), 1000)) {
            messageEmbed.addField(guildDaoManager.localeService.languageRecord.eventLogger.keyword.permissions, `**${guildDaoManager.localeService.languageRecord.eventLogger.keyword.roles}:** ${roles.join(" ")}
                **${guildDaoManager.localeService.languageRecord.eventLogger.keyword.allow}:** \`${permission}\``, true);
        }
    }
}
