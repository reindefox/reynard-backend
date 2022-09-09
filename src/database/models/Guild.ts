import { EventList } from "@src/assets/json/eventsList";
import { LocaleType } from "@src/assets/json/locale";
import { TimezoneType } from "@src/assets/json/timezone";
import { BaseDataModel, getSetParse } from "@src/database/models/base/BaseDataModel";
import { InfractionAction } from "@src/database/structures/InfractionActions";
import { PostgreSQL } from "@src/scripts/PostgreSQLHandler";
import { HexColorString } from "discord.js";
import { DataTypes } from "sequelize";
import { ModelCtor } from "sequelize/types/lib/model";

export const Guild: ModelCtor<GuildModel> = PostgreSQL.instance.sequelize.define<GuildModel>("Guild", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        field: "id"
    },
    guildID: {
        type: DataTypes.STRING,
        field: "guild_id"
    },
    prefix: {
        type: DataTypes.STRING,
        field: "prefix"
    },
    timezone: {
        type: DataTypes.STRING,
        field: "timezone"
    },
    locale: {
        type: DataTypes.STRING,
        field: "locale"
    },
    commandsLocale: {
        type: DataTypes.STRING,
        field: "commands_locale"
    },
    logModuleToggle: {
        type: DataTypes.BOOLEAN,
        field: "log_module_toggle"
    },
    listenBots: {
        type: DataTypes.BOOLEAN,
        field: "listen_bots"
    },
    logIgnoredMembers: {
        type: DataTypes.STRING,
        field: "log_ignored_members",
        ...getSetParse("logIgnoredMembers", Array)
    },
    logIgnoredChannels: {
        type: DataTypes.STRING,
        field: "log_ignored_channels",
        ...getSetParse("logIgnoredChannels", Array)
    },
    logs: {
        type: DataTypes.STRING,
        field: "logs",
        ...getSetParse("logs", Object)
    },
    showLogExecutor: {
        type: DataTypes.BOOLEAN,
        field: "show_log_executor"
    },
    muteRoleID: {
        type: DataTypes.STRING,
        field: "mute_role_id"
    },
    mentionUsers: {
        type: DataTypes.BOOLEAN,
        field: "mention_users"
    },
    embedColor: {
        type: DataTypes.STRING,
        field: "embed_color"
    },
    delSucMsgAfter: {
        type: DataTypes.SMALLINT,
        field: "del_suc_msg_after"
    },
    delErrMsgAfter: {
        type: DataTypes.SMALLINT,
        field: "del_err_msg_after"
    },
    delSrcMsg: {
        type: DataTypes.BOOLEAN,
        field: "del_src_msg"
    },
    useReplies: {
        type: DataTypes.BOOLEAN,
        field: "use_replies"
    },
    manageableMuteRole: {
        type: DataTypes.BOOLEAN,
        field: "manageable_mute_role"
    },
    infractionActions: {
        type: DataTypes.STRING,
        field: "infraction_actions",
        ...getSetParse("infractionActions", Array)
    },
    premiumUntil: {
        type: DataTypes.INTEGER,
        field: "premium_until"
    },
    removeRolesMute: {
        type: DataTypes.STRING,
        field: "remove_roles_mute",
        ...getSetParse("removeRolesMute", Array)
    },
    coolDownIgnoreRoot: {
        type: DataTypes.BOOLEAN,
        field: "cd_ignore_root"
    },
    notifyOnPunishment: {
        type: DataTypes.BOOLEAN,
        field: "notify_on_punishment"
    },
    useSlashCommands: {
        type: DataTypes.BOOLEAN,
        field: "use_slash_commands"
    },
    resetWarnsOnPunishment: {
        type: DataTypes.BOOLEAN,
        field: "reset_warns_on_punish"
    }
}, {
    tableName: "guilds"
});

export interface GuildModel extends BaseDataModel {
    id: number;
    guildID: string;
    prefix: string;
    timezone: TimezoneType;
    locale: LocaleType;
    commandsLocale: LocaleType;
    logModuleToggle: boolean;
    listenBots: boolean;
    logIgnoredMembers: string[];
    logIgnoredChannels: string[];
    logs: EventList;
    showLogExecutor: boolean;
    muteRoleID: string;
    mentionUsers: boolean;
    embedColor: HexColorString;
    delSucMsgAfter: number;
    delErrMsgAfter: number;
    delSrcMsg: boolean;
    useReplies: boolean;
    manageableMuteRole: boolean;
    infractionActions: InfractionAction[];
    premiumUntil: number;
    removeRolesMute: string[];
    coolDownIgnoreRoot: boolean;
    notifyOnPunishment: boolean;
    useSlashCommands: boolean;
    resetWarnsOnPunishment: boolean;
}
