import { BaseDataModel, getSetParse } from "@src/database/models/base/BaseDataModel";
import { PostgreSQL } from "@src/scripts/PostgreSQLHandler";
import { DataTypes } from "sequelize";
import { ModelCtor } from "sequelize/types/lib/model";

export const Mute: ModelCtor<MuteModel> = PostgreSQL.instance.sequelize.define<MuteModel>("Mute", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        field: "id"
    },
    userID: {
        type: DataTypes.STRING,
        field: "user_id"
    },
    invokerID: {
        type: DataTypes.STRING,
        field: "invoker_id"
    },
    guildID: {
        type: DataTypes.STRING,
        field: "guild_id"
    },
    reason: {
        type: DataTypes.STRING,
        field: "reason"
    },
    timestamp: {
        type: DataTypes.INTEGER,
        field: "timestamp"
    },
    duration: {
        type: DataTypes.STRING,
        field: "duration"
    },
    muteRoleID: {
        type: DataTypes.STRING,
        field: "mute_role_id"
    },
    isHardMute: {
        type: DataTypes.BOOLEAN,
        field: "is_hard_mute"
    },
    hardMuteRoles: {
        type: DataTypes.STRING,
        field: "hard_mute_roles",
        ...getSetParse("hardMuteRoles", Array)
    }
}, {
    tableName: "mutes"
});

export interface MuteModel extends BaseDataModel {
    id: number;
    userID: string;
    invokerID: string;
    guildID: string;
    reason: string;
    timestamp: number;
    duration: number;
    muteRoleID: string;
    isHardMute: boolean;
    hardMuteRoles: string[];
}
