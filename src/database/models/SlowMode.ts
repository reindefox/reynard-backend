import { BaseDataModel } from "@src/database/models/base/BaseDataModel";
import { PostgreSQL } from "@src/scripts/PostgreSQLHandler";
import { DataTypes } from "sequelize";
import { ModelCtor } from "sequelize/types/lib/model";

export const SlowMode: ModelCtor<SlowModeModel> = PostgreSQL.instance.sequelize.define<SlowModeModel>("SlowMode", {
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
    channelID: {
        type: DataTypes.STRING,
        field: "channel_id"
    },
    timestamp: {
        type: DataTypes.INTEGER,
        field: "timestamp"
    },
    duration: {
        type: DataTypes.INTEGER,
        field: "duration"
    }
}, {
    tableName: "slowmodes"
});

export interface SlowModeModel extends BaseDataModel {
    id: number;
    guildID: string;
    channelID: string;
    timestamp: number;
    duration: number;
}
