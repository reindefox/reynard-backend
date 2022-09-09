import { BaseDataModel } from "@src/database/models/base/BaseDataModel";
import { PostgreSQL } from "@src/scripts/PostgreSQLHandler";
import { DataTypes } from "sequelize";
import { ModelCtor } from "sequelize/types/lib/model";

export const Warn: ModelCtor<WarnModel> = PostgreSQL.instance.sequelize.define<WarnModel>("Warn", {
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
    guildCaseID: {
        type: DataTypes.INTEGER,
        field: "guild_case_id"
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
    }
}, {
    tableName: "warns"
});

export interface WarnModel extends BaseDataModel {
    id: number;
    userID: string;
    invokerID: string;
    guildID: string;
    guildCaseID: number;
    reason: string;
    timestamp: number;
    duration: number;
}
