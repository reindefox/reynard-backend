import { MentionType } from "@src/api/subscriptions/BasePosting";
import { BaseSubscriptionModel } from "@src/database/models/base/BaseSubscriptionModel";
import { PostgreSQL } from "@src/scripts/PostgreSQLHandler";
import { DataTypes } from "sequelize";
import { ModelCtor } from "sequelize/types/lib/model";

export const VKSubscription: ModelCtor<VKSubscriptionModel> = PostgreSQL.instance.sequelize.define<VKSubscriptionModel>("VKSubscription", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        field: "id"
    },
    token: {
        type: DataTypes.STRING,
        field: "token"
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
    mentionType: {
        type: DataTypes.SMALLINT,
        field: "mention_type"
    },
}, {
    tableName: "vk_subscriptions"
});

export interface VKSubscriptionModel extends BaseSubscriptionModel {
    id: number;
    token: string;
    guildID: string;
    mentionType: MentionType;
}
