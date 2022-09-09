import { MentionType } from "@src/api/subscriptions/BasePosting";
import { getSetParse } from "@src/database/models/base/BaseDataModel";
import { BaseSubscriptionModel } from "@src/database/models/base/BaseSubscriptionModel";
import { PostgreSQL } from "@src/scripts/PostgreSQLHandler";
import { DataTypes } from "sequelize";
import { ModelCtor } from "sequelize/types/lib/model";

export const TwitchSubscription: ModelCtor<TwitchSubscriptionModel> = PostgreSQL.instance.sequelize.define<TwitchSubscriptionModel>("TwitchSubscription", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        field: "id"
    },
    login: {
        type: DataTypes.STRING,
        field: "login"
    },
    userID: {
        type: DataTypes.STRING,
        field: "user_id"
    },
    toggle: {
        type: DataTypes.BOOLEAN,
        field: "toggle"
    },
    guildID: {
        type: DataTypes.STRING,
        field: "guild_id"
    },
    webhookID: {
        type: DataTypes.STRING,
        field: "webhook_id"
    },
    webhookToken: {
        type: DataTypes.STRING,
        field: "webhook_token"
    },
    message: {
        type: DataTypes.STRING,
        field: "message"
    },
    mentionType: {
        type: DataTypes.SMALLINT,
        field: "mention_type"
    },
    usePreview: {
        type: DataTypes.BOOLEAN,
        field: "use_preview"
    },
    streamNameFilter: {
        type: DataTypes.STRING,
        field: "stream_name_filter",
        ...getSetParse("streamNameFilter", Array)
    },
    gameNameFilter: {
        type: DataTypes.STRING,
        field: "game_name_filter",
        ...getSetParse("gameNameFilter", Array)
    }
}, {
    tableName: "twitch_subscriptions"
});

export interface TwitchSubscriptionModel extends BaseSubscriptionModel {
    id: number;
    login: string;
    userID: string;
    guildID: string;
    message: string;
    mentionType: MentionType;
    usePreview: boolean;
    streamNameFilter: string[];
    gameNameFilter: string[];
}
