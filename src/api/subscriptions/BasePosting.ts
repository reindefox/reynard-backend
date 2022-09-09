import { BaseSubscriptionModel } from "@src/database/models/base/BaseSubscriptionModel";
import { ShardManager } from "@src/services/shard/ShardManager";
import { WebhookClient } from "discord.js";

export abstract class BasePosting {
    public static async fetchSubscriptionWebhook(webhookID: string, webhookToken: string, model: BaseSubscriptionModel): Promise<WebhookClient> {
        let webhook: WebhookClient = ShardManager.fetchWebhook(webhookID, webhookToken);

        if (webhook) {
            return webhook;
        }

        webhook = await BasePosting.createSubscriptionWebhook(model);

        return webhook;
    }

    public static async createSubscriptionWebhook(model: BaseSubscriptionModel): Promise<WebhookClient> {
        model.webhookID = null;
        model.webhookToken = null;
        model.toggle = false;

        await model.save();

        // todo create this via storing channelID in row

        return null;
    }
}

export type SubscriptionType =
    "twitch"
    | "vk"
    | "youtube"

export enum MentionType {
    NONE,
    EVERYONE,
    HERE
}
