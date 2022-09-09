import { BaseDataModel, getSetParse } from "@src/database/models/base/BaseDataModel";
import { PostgreSQL } from "@src/scripts/PostgreSQLHandler";
import { DataTypes } from "sequelize";
import { ModelCtor } from "sequelize/types/lib/model";

export const CommandConfig: ModelCtor<CommandConfigModel> = PostgreSQL.instance.sequelize.define<CommandConfigModel>("CommandConfig", {
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
    key: {
        type: DataTypes.STRING,
        field: "key"
    },
    toggle: {
        type: DataTypes.BOOLEAN,
        field: "toggle"
    },
    delSrcMsg: {
        type: DataTypes.BOOLEAN,
        field: "del_src_msg"
    },
    hidden: {
        type: DataTypes.BOOLEAN,
        field: "hidden"
    },
    nsfwOnly: {
        type: DataTypes.BOOLEAN,
        field: "nsfw_only"
    },
    coolDown: {
        type: DataTypes.SMALLINT,
        field: "cooldown"
    },
    ignoredRoles: {
        type: DataTypes.STRING,
        field: "ignored_roles",
        ...getSetParse("ignoredRoles", Array)
    },
    allowedRoles: {
        type: DataTypes.STRING,
        field: "allowed_roles",
        ...getSetParse("allowedRoles", Array)
    },
    ignoredChannels: {
        type: DataTypes.STRING,
        field: "ignored_channels",
        ...getSetParse("ignoredChannels", Array)
    },
    allowedChannels: {
        type: DataTypes.STRING,
        field: "allowed_channels",
        ...getSetParse("allowedChannels", Array)
    },
    ignoredMembers: {
        type: DataTypes.STRING,
        field: "ignored_members",
        ...getSetParse("ignoredMembers", Array)
    },
    allowedMembers: {
        type: DataTypes.STRING,
        field: "allowed_members",
        ...getSetParse("allowedMembers", Array)
    }
}, {
    tableName: "command_config"
});

export interface CommandConfigModel extends BaseDataModel, CommandConfigOptions {
    id: number;
    guildID: string;
}

export interface CommandConfigOptions {
    key: string;
    toggle: boolean;
    delSrcMsg: boolean;
    hidden: boolean;
    nsfwOnly: boolean;
    coolDown: number;
    ignoredRoles: string[];
    allowedRoles: string[];
    ignoredChannels: string[];
    allowedChannels: string[];
    ignoredMembers: string[];
    allowedMembers: string[];
}
